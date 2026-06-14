import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState, forwardRef } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DataBrowser from '@/Components/DataBrowser';
import BaseModal from '@/Components/Modals/BaseModal';
import { temporaryHomeSchema, TemporaryHomeFormData } from '@/lib/schemas/temporaryHomeSchema';
import { Animal } from '@/types/animal';
import { z } from 'zod';

// 🛡️ Importando a constante global de Estados que você criou
import { ESTADOS_BR } from '@/lib/constants/address';

// ── Tipagens ──────────────────────────────────────────────────────────────
interface User {
    id: string;
    name: string;
    email: string;
}

interface Address {
    zip_code: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
}

interface TemporaryHome {
    id: string;
    name: string;
    phone: string;
    max_capacity: number;
    notes?: string;
    address?: Address;
    animals?: Animal[];
}

interface PaginatedTemporaryHomes {
    data: TemporaryHome[];
}

interface Props {
    auth: { user: User };
    temporaryHomes: TemporaryHome[] | PaginatedTemporaryHomes;
}

declare function route(name: string, params?: any): string;

// ── Helpers e Ícones ────────────────────────────────────────────────────────
const formatPhone = (phone?: string) => {
    if (!phone) return '—';
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const HomeIcon = () => (
    <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
    ({ label, error, className, disabled, ...props }, ref) => (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                ref={ref}
                disabled={disabled}
                {...props}
                className={`w-full rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 
                ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
                ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} ${className || ''}`}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    )
);

// ── 🚀 FORMULÁRIO ESPECIALIZADO ──
interface TemporaryHomeFormProps {
    initialData: TemporaryHome | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const TemporaryHomeForm = ({ initialData, onSuccess, onCancel }: TemporaryHomeFormProps) => {
    const isEditing = !!initialData;
    
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof temporaryHomeSchema>>({
        resolver: zodResolver(temporaryHomeSchema),
        mode: 'onBlur',
        defaultValues: {
            name: initialData?.name || '',
            phone: initialData?.phone || '',
            max_capacity: initialData?.max_capacity || 1,
            notes: initialData?.notes || '',
            zip_code: initialData?.address?.zip_code || '',
            street: initialData?.address?.street || '',
            number: initialData?.address?.number || '',
            neighborhood: initialData?.address?.neighborhood || '',
            city: initialData?.address?.city || '',
            state: initialData?.address?.state || '',
        }
    });

    const [loadingCep, setLoadingCep] = useState(false);

    const fetchCep = async (cepValue: string) => {
        const cep = cepValue.replace(/\D/g, ''); 
        if (cep.length !== 8) return;
        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const result = await response.json();
            if (!result.erro) {
                setValue('street', result.logradouro || '', { shouldValidate: true });
                setValue('neighborhood', result.bairro || '', { shouldValidate: true });
                setValue('city', result.localidade || '', { shouldValidate: true });
                setValue('state', result.uf || '', { shouldValidate: true });
                setTimeout(() => document.getElementById('address_number')?.focus(), 100);
            } else { alert('CEP não encontrado.'); }
        } catch (error) {
            alert('Não foi possível conectar ao serviço de CEP. Verifique se o seu navegador não está bloqueando chamadas externas.');
        } finally { setLoadingCep(false); }
    };

    const onSubmit: SubmitHandler<TemporaryHomeFormData> = (formData) => {
        const url = isEditing && initialData ? route('temporary-homes.update', initialData.id) : route('temporary-homes.store');
        
        if (isEditing) {
            router.put(url, formData, {
                onSuccess,
                onError: (errs) => {
                    Object.keys(errs).forEach((key) => {
                        setError(key as keyof TemporaryHomeFormData, { type: 'server', message: errs[key] });
                    });
                }
            });
        } else {
            router.post(url, formData, {
                onSuccess,
                onError: (errs) => {
                    Object.keys(errs).forEach((key) => {
                        setError(key as keyof TemporaryHomeFormData, { type: 'server', message: errs[key] });
                    });
                }
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                    <InputGroup label="Nome do Responsável / Família" {...register('name')} error={errors.name?.message} />
                </div>
                
                {/* 🛡️ Telefone formatado ao vivo integrado ao React Hook Form */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                    <input
                        type="text"
                        placeholder="(11) 99999-9999"
                        maxLength={15}
                        {...register('phone', {
                            onChange: (e) => {
                                let v = e.target.value.replace(/\D/g, '');
                                v = v.substring(0, 11);
                                if (v.length > 10) {
                                    v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
                                } else if (v.length > 6) {
                                    v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
                                } else if (v.length > 2) {
                                    v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                                } else if (v.length > 0) {
                                    v = v.replace(/^(\d{0,2})/, '($1');
                                }
                                e.target.value = v;
                                setValue('phone', v, { shouldValidate: true });
                            }
                        })}
                        className={`w-full rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white text-gray-900 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
                </div>

                <InputGroup
                    label="Capacidade Máxima (Animais)"
                    type="number"
                    min={1}
                    {...register('max_capacity', {
                        valueAsNumber: true,
                    })}
                    error={errors.max_capacity?.message}
                />
                
                <div className="col-span-1 sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anotações (Restrições, regras do condomínio, etc.)</label>
                    <textarea rows={2} {...register('notes')} className="w-full rounded-lg border-gray-300 text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 resize-none"></textarea>
                </div>

                <div className="col-span-1 sm:col-span-2 mt-2 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Endereço do Lar</h4>
                </div>

                <div className="relative">
                    <InputGroup label="CEP" maxLength={9} placeholder="00000-000" {...register('zip_code', { 
                        onChange: (e) => { 
                             let v = e.target.value.replace(/\D/g, ''); 
                             if(v.length > 5) v = v.replace(/^(\d{5})(\d)/, '$1-$2');
                             e.target.value = v;
                             setValue('zip_code', v, { shouldValidate: true });
                             if(v.replace(/\D/g, '').length === 8) fetchCep(v);
                        },
                        onBlur: (e) => { if (e.target.value.replace(/\D/g, '').length === 8) fetchCep(e.target.value); }
                    })} error={errors.zip_code?.message} />
                    {loadingCep && <div className="absolute right-3 top-8"><span className="animate-ping h-3 w-3 rounded-full bg-indigo-500"></span></div>}
                </div>
                
                <InputGroup label="Logradouro (Rua/Av)" {...register('street')} error={errors.street?.message} disabled={loadingCep} />
                <InputGroup id="address_number" label="Número" {...register('number')} error={errors.number?.message} />
                <InputGroup label="Bairro" {...register('neighborhood')} error={errors.neighborhood?.message} disabled={loadingCep} />
                <InputGroup label="Cidade" {...register('city')} error={errors.city?.message} disabled={loadingCep} />
                
                {/* 🛡️ Dropdown de UF consumindo do constants */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UF (Estado)</label>
                    <select
                        {...register('state')}
                        disabled={loadingCep}
                        className={`w-full rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 
                        ${loadingCep ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
                        ${errors.state ? 'border-red-500' : ''}`}
                    >
                        <option value="">Selecione...</option>
                        {ESTADOS_BR.map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                        ))}
                    </select>
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state.message}</p>}
                </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">{isSubmitting ? 'Salvando...' : 'Confirmar'}</button>
            </div>
        </form>
    );
};

// ── TELA PRINCIPAL ──────────────────────────────────────────────────────────
export default function Index({ auth, temporaryHomes }: Props) {
    const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; data: TemporaryHome | null }>({ isOpen: false, data: null });
    const [residentsModal, setResidentsModal] = useState<{ isOpen: boolean; animals: Animal[]; homeName: string }>({ isOpen: false, animals: [], homeName: '' });
    
    const closeModal = () => setModalConfig({ isOpen: false, data: null });
    const homesArray = Array.isArray(temporaryHomes) ? temporaryHomes : temporaryHomes.data;

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Rede de Apoio <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Lares Temporários</span>
                </h2>
            }
        >
            <Head title="Lares Temporários" />

            <DataBrowser 
                title="Rede de Lares Temporários"
                subtitle="Lares disponíveis para acolhimento temporário de animais."
                data={homesArray}
                columns={[
                    { label: 'RESPONSÁVEL / FAMÍLIA', key: 'name', render: (val, home) => (
                        <div><span className="font-bold text-gray-900 block">{val}</span><span className="text-xs text-gray-500">{formatPhone(home.phone)}</span></div>
                    )},
                    { label: 'CAPACIDADE', key: 'max_capacity', render: (val, home) => (
                        <button onClick={() => setResidentsModal({ isOpen: true, animals: home.animals || [], homeName: home.name })} className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer">{home.animals?.length || 0} / {val} {val === 1 ? 'animal' : 'animais'}</button>
                    )},
                    { label: 'LOCALIDADE', key: 'address', render: (_, home) => <span className="text-gray-600">{home.address?.city} - {home.address?.state}</span>},
                    { label: 'AÇÕES', key: 'actions', render: (_, home) => (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setModalConfig({ isOpen: true, data: home })} className="p-2 bg-gray-100 text-gray-600 hover:bg-indigo-100 rounded-lg transition-colors"><EditIcon /></button>
                            <Link href={route('temporary-homes.destroy', home.id)} method="delete" as="button" onClick={(e) => { if (!confirm(`Tem certeza que deseja excluir o lar de ${home.name}?`)) e.preventDefault(); }} className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"><TrashIcon /></Link>
                        </div>
                    )}
                ]}
                renderMobileCard={(home) => (
                    <div key={home.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3 items-center">
                                <HomeIcon />
                                <div>
                                    <h3 className="font-bold text-gray-900">{home.name}</h3>
                                    <p className="text-sm text-gray-500">{formatPhone(home.phone)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setModalConfig({ isOpen: true, data: home })} className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg">
                                    <EditIcon />
                                </button>
                                {/* No Mobile, se preferir o ícone de deletar flutuante também, descomente abaixo */}
                                { <Link href={route('temporary-homes.destroy', home.id)} method="delete" as="button" onClick={(e) => { if (!confirm(`Tem certeza que deseja excluir o lar de ${home.name}?`)) e.preventDefault(); }} className="text-red-600 bg-red-50 p-1.5 rounded-lg"><TrashIcon /></Link> }
                            </div>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100 text-sm">
                            <span className="text-gray-600">📍 {home.address?.city && home.address?.state ? `${home.address.city}/${home.address.state}` : 'Sem Endereço'}</span>
                            <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Cap: {home.animals?.length || 0}/{home.max_capacity}</span>
                        </div>
                    </div>
                )}
                onAddClick={() => setModalConfig({ isOpen: true, data: null })}
                addLabel="Cadastrar Lar"
                searchPlaceholder="Buscar por nome, cidade ou telefone..."
                searchFn={(home, query) => (home.name || '').toLowerCase().includes(query) || (home.phone || '').includes(query) || (home.address?.city || '').toLowerCase().includes(query)}
                sortFn={(a, b) => a.name.localeCompare(b.name)}
            />

            <BaseModal isOpen={modalConfig.isOpen} onClose={closeModal} title={modalConfig.data ? `Editar Lar: ${modalConfig.data.name}` : 'Cadastrar Novo Lar Temporário'}>
                <TemporaryHomeForm initialData={modalConfig.data} onSuccess={closeModal} onCancel={closeModal} />
            </BaseModal>

            <BaseModal isOpen={residentsModal.isOpen} onClose={() => setResidentsModal({ isOpen: false, animals: [], homeName: '' })} title={`Animais em: ${residentsModal.homeName}`}>
                <div className="p-6">
                    {residentsModal.animals.length > 0 ? (
                        residentsModal.animals.map(animal => (
                            <div key={animal.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 mb-2">
                                <div className="w-10 h-10 bg-white rounded-lg border overflow-hidden">{animal.photo_url ? <img src={animal.photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300">🐾</div>}</div>
                                <div className="flex-1"><h4 className="text-sm font-bold text-gray-800">{animal.name}</h4><p className="text-xs text-gray-500">{animal.species === 'dog' ? 'Cachorro' : 'Gato'} • {animal.gender === 'male' ? 'Macho' : 'Fêmea'}</p></div>
                                <Link href={route('animals.show', animal.id)} className="text-[10px] font-bold text-indigo-600 hover:underline">VER PERFIL</Link>
                            </div>
                        ))
                    ) : <div className="text-center py-10"><p className="text-gray-400 text-sm">Nenhum animal nesta casa no momento.</p></div>}
                </div>
            </BaseModal>
        </AuthenticatedLayout>
    );
}