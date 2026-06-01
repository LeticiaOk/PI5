import { useForm } from '@inertiajs/react';
import { useState, useRef, useEffect, useMemo } from 'react';
import InputError from '@/Components/InputError';
import {AnimalFormData, Breed} from '@/types/animal'
import { animalFormSchema } from '@/lib/schemas/animalSchema';

interface CreateAnimalModalProps {
    isOpen: boolean;
    onClose: () => void;
    breeds: Breed[];
}

// Rendreiza icone de camera
const CameraIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <circle cx="12" cy="13" r="4" />
    </svg>
);

const CloseIcon = () => (
    <svg className="w-6 h-6 text-gray-500 hover:text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Renderiza modal de criacao de animal
export default function CreateAnimalModal({ isOpen, onClose, breeds,}:CreateAnimalModalProps) {
    // inicializa referencias e estados locais
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
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
    });

    // Previne Memory Leak limpando URL Local
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);
      // 3. Funções de Manipulação (Handlers)

    // Se o modal não estiver aberto, não renderiza nada (O 'return' para o fluxo aqui)
  

  
    
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
                        // @ts-ignore (Ignoramos o TS estrito aqui apenas para o Inertia aceitar o File nativo)
                        setData('photo', croppedFile);
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

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Valida os dados no frontend antes de bater no servidor
        const result = animalFormSchema.safeParse(data);

        if (!result.success) {
            // Mapeia os erros do Zod para visualização (opcional, pois o Inertia/Laravel também validam)
            console.error("Erros de validação:", result.error.format());
            // Retorna para impedir o envio se o frontend pegar erro
            return; 
        }

        post('/animals', {
            preserveScroll: true,
            onSuccess: () => fecharModal(),
        });
    };

    // Congela a lista de raças na memória, recalculando apenas se a espécie mudar
 const filteredBreeds = useMemo(() => {
        return (breeds || []).filter((breed) => breed.species === data.species);
    }, [breeds, data.species]);

      if (!isOpen) return null;

    // 4. Renderização do HTML (Este é o 'return' que estava dando erro)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/70">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden relative animate-in fade-in zoom-in duration-200">
                
                {/* Header fixo */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Cadastrar animal</h2>
                    <button onClick={fecharModal} className="p-1 focus:outline-none">
                        <CloseIcon />
                    </button>
                </div>

                {/* Área de rolagem do formulário */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="animalForm" onSubmit={submit} className="space-y-5">
                        
                        {/* Foto Upload */}
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/jpeg, image/png, image/webp"
                                onChange={handlePhotoChange} 
                            />
                            <div 
                                onClick={() => fileInputRef.current.click()}
                                className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group overflow-hidden"
                            >
                                {preview ? (
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <CameraIcon />
                                )}
                                {/* Overlay escuro com ícone de edição */}
                                {preview && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.photo} className="mt-1" />
                        </div>

                        {/* Nome */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do animal *</label>
                            <input
                                type="text"
                                placeholder="Ex: Thor"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>

                        {/* Espécie (Radios) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Espécie</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input type="radio" value="dog" checked={data.species === 'dog'} onChange={e => setData('species', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    Cachorro
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input type="radio" value="cat" checked={data.species === 'cat'} onChange={e => setData('species', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    Gato
                                </label>
                            </div>
                            <InputError message={errors.species} className="mt-1" />
                        </div>

                     {/* Raça */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Raça</label>
                            <select
                                value={data.breed_id || ''}
                                onChange={(e) => setData('breed_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black bg-white"
                            >
                                <option value="">Sem raça definida (SRD)</option>
                                {filteredBreeds.map((breed) => (
                                    <option key={breed.id} value={breed.id}>{breed.name}</option>
                                ))}
                            </select>
                            <InputError message={errors.breed_id} className="mt-1" />
                        </div>

                        {/* Porte e Peso */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Porte</label>
                                <select value={data.size} onChange={e => setData('size', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black bg-white">
                                    <option value="small">Pequeno (P)</option>
                                    <option value="medium">Médio (M)</option>
                                    <option value="large">Grande (G)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Peso</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="Ex: 12"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black"
                                    value={data.weight}
                                    onChange={e => setData('weight', e.target.value)}
                                />
                                <InputError message={errors.weight} className="mt-1" />
                            </div>
                        </div>

                        {/* Datas */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de nascimento</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-1 focus:ring-black focus:border-black"
                                    value={data.estimated_birth_date}
                                    onChange={e => setData('estimated_birth_date', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de chegada *</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-1 focus:ring-black focus:border-black"
                                    value={data.arrival_date}
                                    onChange={e => setData('arrival_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.arrival_date} className="mt-1" />
                            </div>
                        </div>

                        {/* Sexo (Radios) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sexo</label>
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input type="radio" value="male" checked={data.gender === 'male'} onChange={e => setData('gender', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    Macho
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input type="radio" value="female" checked={data.gender === 'female'} onChange={e => setData('gender', e.target.value)} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    Fêmea
                                </label>
                            </div>
                        </div>

                        {/* Saúde (Checkboxes inline) */}
                        <div className="flex items-center flex-wrap gap-4 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                <input type="checkbox" checked={data.is_neutered} onChange={e => setData('is_neutered', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                Castrado
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                <input type="checkbox" checked={data.is_vaccinated} onChange={e => setData('is_vaccinated', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                Vacinado
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                <input type="checkbox" checked={data.is_dewormed} onChange={e => setData('is_dewormed', e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                Vermifugado
                            </label>
                        </div>

                        {/* Sobre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sobre</label>
                            <textarea
                                placeholder="Escreva..."
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black resize-none"
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-black focus:border-black bg-white">
                                <option value="available">Disponível</option>
                                <option value="adopted">Adotado</option>
                                <option value="under_treatment">Em tratamento</option>
                                <option value="foster_care">Lar temporário</option>
                                <option value="deceased">Óbito</option>
                            </select>
                        </div>

                    </form>
                </div>

                {/* Footer fixo com botão */}
                <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
                    <button 
                        type="submit" 
                        form="animalForm" 
                        disabled={processing}
                        className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition-colors"
                    >
                        {processing ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>

            </div>
        </div>
    );
}