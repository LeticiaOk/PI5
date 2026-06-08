import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import InputError from '@/Components/InputError';
import { Animal, Breed, TemporaryHome, AnimalFormData } from '@/types/animal';
import { animalFormSchema } from '@/lib/schemas/animalSchema';
import { z } from 'zod';

// Define propriedades do componente modal de edição
interface EditAnimalModalProps {
    isOpen: boolean;
    onClose: () => void;
    animal?: Animal;
    temporaryHomes: TemporaryHome[];
    breeds: Breed[];
}

// Renderiza ícone de câmera
const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

// Renderiza ícone de fechar
const CloseIcon = () => (
    <svg className="w-6 h-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Componente principal do Modal de Edição
export default function EditAnimalModal({ isOpen, onClose, animal, temporaryHomes = [], breeds = [] }: EditAnimalModalProps) {
    // Inicializa referências e estados locais
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    
   const editSchema = animalFormSchema.extend({ _method: z.literal('put') });
    type EditFormValues = z.infer<typeof editSchema>;
    
    // Tipamos com AnimalFormData + _method para o Laravel aceitar o PUT com arquivo
   const { register, handleSubmit, setValue, watch, reset, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<EditFormValues>({
       resolver: zodResolver(editSchema),
        mode: 'onBlur',
        defaultValues: {
            _method: 'put',
            name: '',
            species: 'dog',
            breed_id: '',
            gender: 'male',
            size: 'small',
            weight: '',
            arrival_date: '',
            estimated_birth_date: '',
            is_neutered: false,
            is_vaccinated: false,
            is_dewormed: false,
            photo: null,
            description: '',
            status: 'available',
            temporary_home_id: '',
        }
    });

    const watchSpecies = watch('species');
    const watchStatus = watch('status'); //  Vigia o status para mostrar/esconder o Lar Temporário

    // Sincroniza formulário com o animal recebido via props
    useEffect(() => {
        if (animal && isOpen) {
            reset({
              _method: 'put',
                name: animal.name || '',
                species: animal.species || 'dog',
                breed_id: animal.breed?.id || '',
                gender: animal.gender || 'male',
                size: animal.size || 'small',
                weight: animal.weight ? String(animal.weight) : '',
                arrival_date: animal.arrival_date ? animal.arrival_date.split('T')[0] : '',
                estimated_birth_date: animal.estimated_birth_date ? animal.estimated_birth_date.split('T')[0] : '',
                is_neutered: !!animal.is_neutered,
                is_vaccinated: !!animal.is_vaccinated,
                is_dewormed: !!animal.is_dewormed,
                photo: null, 
                description: animal.description || '',
                status: animal.status || 'available',
                temporary_home_id: animal.temporary_home?.id || '',
            });
            setPreview(animal.photo_url || null);
        }
    }, [animal, isOpen, reset]);

    // Limpa a memória da URL da imagem local ao fechar o modal
    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
        };
    }, [preview]);

  // Redimensiona a foto para 300x300 no navegador e converte para WebP (Zero Backend)
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Define um quadrado perfeito de 300x300
                const size = 300;
                canvas.width = size;
                canvas.height = size;
                
                // Lógica matemática para corte centralizado (Crop Cover)
                const minDim = Math.min(img.width, img.height);
                const startX = (img.width - minDim) / 2;
                const startY = (img.height - minDim) / 2;
                
                // Desenha a imagem cortada no Canvas
                ctx?.drawImage(img, startX, startY, minDim, minDim, 0, 0, size, size);
                
                // Converte o Canvas em um arquivo WebP super leve
                canvas.toBlob((blob) => {
                    if (blob) {
                        const croppedFile = new File([blob], "photo.webp", { type: 'image/webp' });
                        setValue('photo', croppedFile, { shouldValidate: true });
                        setPreview(URL.createObjectURL(croppedFile));
                    }
                }, 'image/webp', 0.8);
                };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };
                
    const fecharModal = () => {
        reset();
        clearErrors();
        setPreview(null);
        onClose();
    };

    const onSubmit = (formData: EditFormValues) => {
        const payload = { ...formData };
        if (payload.weight) {
            payload.weight = payload.weight.toString().replace(',', '.');
        }
        
        router.post(`/animals/${animal?.id}`, payload, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => fecharModal(),
            onError: (backendErrors) => {
                Object.keys(backendErrors).forEach((key) => {
                    setError(key as keyof AnimalFormData, { type: 'server', message: backendErrors[key] });
                });
            }
        });
    };

    const filteredBreeds = useMemo(() => {
        return (breeds || []).filter((breed) => breed.species === watchSpecies);
    }, [breeds, watchSpecies]);

    // O retorno condicional DEVE ficar aqui, abaixo de todos os hooks
    if (!isOpen || !animal) return null;

return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/70">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] my-8 flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">Editar animal</h2>
                    <button onClick={fecharModal} className="p-1 focus:outline-none"><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* 💡 Conectado ao RHF */}
                    <form id="editAnimalForm" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        
                        <div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handlePhotoChange} />
                            <div onClick={() => fileInputRef.current?.click()} className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group overflow-hidden">
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <CameraIcon />
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold">Trocar foto</span>
                                </div>
                            </div>
                            <InputError message={errors.photo} className="mt-1" />
                        </div>

                       <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do animal *</label>
                            <input type="text" {...register('name')} className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.name && <InputError message={errors.name.message} className="mt-1" />}
                        </div>

                       <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Espécie</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input type="radio" value="dog" {...register('species')} /> Cachorro
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input type="radio" value="cat" {...register('species')} /> Gato
                                </label>
                            </div> 
                            {errors.species && <InputError message={errors.species.message} className="mt-1" />}
                        </div>

                        {/* Raça */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                            <select
                                {...register('breed_id')}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black bg-white ${errors.breed_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Sem raça definida (SRD)</option>
                                {filteredBreeds.map((breed) => (
                                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                                ))}
                            </select> 
                            {errors.breed_id && <InputError message={errors.breed_id.message as string} className="mt-1" />}
                        </div>

                       <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
                                <select {...register('size')} className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black bg-white ${errors.size ? 'border-red-500' : 'border-gray-300'}`}>
                                    <option value="small">Pequeno (P)</option>
                                    <option value="medium">Médio (M)</option>
                                    <option value="large">Grande (G)</option>
                                </select>
                                {errors.size && <InputError message={errors.size.message} className="mt-1" />}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
                                <input type="text" placeholder="Ex: 12.5" {...register('weight')} className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black ${errors.weight ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.weight && <InputError message={errors.weight.message} className="mt-1" />}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
                                <input type="date" {...register('estimated_birth_date')} className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-1 focus:ring-black ${errors.estimated_birth_date ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.estimated_birth_date && <InputError message={errors.estimated_birth_date.message} className="mt-1" />}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de chegada *</label>
                                <input type="date" {...register('arrival_date')} className={`w-full border rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-1 focus:ring-black ${errors.arrival_date ? 'border-red-500' : 'border-gray-300'}`} />
                                {errors.arrival_date && <InputError message={errors.arrival_date.message} className="mt-1" />}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"><input type="radio" value="male" {...register('gender')} className="w-4 h-4 text-blue-600 border-gray-300" /> Macho</label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"><input type="radio" value="female" {...register('gender')} className="w-4 h-4 text-blue-600 border-gray-300" /> Fêmea</label>
                            </div>
                            {errors.gender && <InputError message={errors.gender.message} className="mt-1" />}
                        </div>

                        {/* 💡 Título Saúde Restaurado com Padding */}
                        <div className="pt-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Saúde</label>
                            <div className="flex items-center flex-wrap gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"><input type="checkbox" {...register('is_neutered')} className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Castrado</label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"><input type="checkbox" {...register('is_vaccinated')} className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Vacinado</label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600"><input type="checkbox" {...register('is_dewormed')} className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Vermifugado</label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sobre</label>
                            <textarea rows={3} {...register('description')} className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black resize-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}></textarea>
                            {errors.description && <InputError message={errors.description.message} className="mt-1" />}
                        </div>

                        <div className="pb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select {...register('status')} className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black bg-white ${errors.status ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="available">Disponível</option>
                                <option value="adopted">Adotado</option>
                                <option value="under_treatment">Em tratamento</option>
                                <option value="foster_care">Lar temporário</option>
                                <option value="deceased">Óbito</option>
                                {watchStatus === 'returned' && <option value="returned" hidden>Retornado</option>}
                            </select>
                            {errors.status && <InputError message={errors.status.message} className="mt-1" />}

                            {/* 💡 Condicional usando o watchStatus do Zod */}
                            {watchStatus === 'foster_care' && (
                                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in duration-200">
                                    <label className="block text-sm font-bold text-blue-800 mb-1">Selecione o Lar Temporário *</label>
                                    <select 
                                        {...register('temporary_home_id')}
                                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 bg-white ${errors.temporary_home_id ? 'border-red-500' : 'border-blue-300'}`}
                                    >
                                        <option value="">-- Escolha um Lar na lista --</option>
                                        {temporaryHomes.map(home => (
                                            <option key={home.id} value={home.id}>
                                                {home.name} (Capacidade: {home.max_capacity})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.temporary_home_id && <InputError message={errors.temporary_home_id.message} className="mt-1" />}
                                </div>
                            )}
                        </div>

                    </form>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50 shrink-0">
                    <button type="submit" form="editAnimalForm" disabled={isSubmitting} className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>

            </div>
        </div>
    );
}