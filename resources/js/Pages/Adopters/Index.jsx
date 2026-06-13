import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import DataBrowser from '@/Components/DataBrowser';
import BaseModal from '@/Components/Modals/BaseModal';
import { ESTADOS_BR } from '@/lib/constants/address';

// ── Helpers de Formatação ─────────────────────────────────────────────────────
const formatCPF = (cpf) => {
    if (!cpf) return '—';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const formatPhone = (phone) => {
    if (!phone) return '—';
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const formatDate = (d) => {
    return d ? new Date(d).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—';
};

// ── Ícones Genéricos ────────────────────────────────────────────────────────
const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);

const HistoryIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const InputGroup = ({ label, id, type = "text", value, onChange, error, onBlur, disabled, maxLength, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input
            id={id} type={type} value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} maxLength={maxLength} placeholder={placeholder}
            className={`w-full rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 
            ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-900'}
            ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

// ── 🚀 FORMULÁRIO ESPECIALIZADO DE ADOTANTE (Com ViaCEP) ────────────────────
const AdopterForm = ({ initialData, onSuccess, onCancel }) => {
    const isEditing = !!initialData;
    
    const { data, setData, post, put, processing, errors } = useForm({
        name: initialData?.name || '',
        cpf: initialData?.cpf || '',
        phone: initialData?.phone || '',
        email: initialData?.email || '',
        zip_code: initialData?.address?.zip_code || '',
        street: initialData?.address?.street || '',
        number: initialData?.address?.number || '',
        neighborhood: initialData?.address?.neighborhood || '',
        city: initialData?.address?.city || '',
        state: initialData?.address?.state || '',
    });

    const [loadingCep, setLoadingCep] = useState(false);

    const fetchCep = async (cepValue) => {
        const cep = cepValue.replace(/\D/g, ''); 
        if (cep.length !== 8) return;

        setLoadingCep(true);
        try {
            // Usando direto a API do ViaCEP para garantir estabilidade
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const result = await response.json();

            if (!result.erro) {
                // 🛡️ A mágica no Inertia para atualizar vários campos de uma vez!
                setData(currentData => ({
                    ...currentData,
                    street: result.logradouro || '',
                    neighborhood: result.bairro || '',
                    city: result.localidade || '',
                    state: result.uf || ''
                }));
                document.getElementById('address_number')?.focus();
            } else {
                alert('CEP não encontrado.');
            }
        } catch (error) {
            alert("Erro ao consultar CEP. Verifique sua internet.");
        } finally {
            setLoadingCep(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('adopters.update', initialData.id), { onSuccess });
        } else {
            post(route('adopters.store'), { onSuccess });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 👤 Dados Pessoais */}
                <InputGroup label="Nome Completo" value={data.name} onChange={e => setData('name', e.target.value)} error={errors.name} />
                <InputGroup label="CPF (Apenas números)" value={data.cpf} onChange={e => setData('cpf', e.target.value.replace(/\D/g, ''))} error={errors.cpf} maxLength="11" />
                
                {/* 🛡️ Telefone com formatação ao vivo */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone/WhatsApp</label>
                    <input
                        type="text"
                        placeholder="(11) 99999-9999"
                        maxLength="15"
                        value={data.phone}
                        onChange={(e) => {
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
                            setData('phone', v);
                        }}
                        className={`w-full rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 bg-white text-gray-900 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
                </div>

                <InputGroup label="E-mail" type="email" value={data.email} onChange={e => setData('email', e.target.value)} error={errors.email} />

                {/* 📍 Endereço */}
                <div className="col-span-1 sm:col-span-2 mt-2 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Endereço</h4>
                </div>

                {/* Campo CEP com Loading */}
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input
                        type="text" maxLength="9" placeholder="00000-000" autoComplete="postal-code"
                        className={`w-full rounded-lg text-sm shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 ${errors.zip_code ? 'border-red-500' : ''}`}
                        value={data.zip_code}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, ''); 
                            if (val.length > 5) val = val.replace(/^(\d{5})(\d)/, '$1-$2'); 
                            setData('zip_code', val);
                            if (val.replace(/\D/g, '').length === 8) fetchCep(val);
                        }}
                        onBlur={(e) => {
                            if (e.target.value.replace(/\D/g, '').length === 8) fetchCep(e.target.value);
                        }}
                    />
                    {loadingCep && (
                        <div className="absolute right-3 top-8">
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                        </div>
                    )}
                    {errors.zip_code && <p className="mt-1 text-xs text-red-600">{errors.zip_code}</p>}
                </div>

                <InputGroup label="Logradouro (Rua/Av)" value={data.street} onChange={e => setData('street', e.target.value)} error={errors.street} disabled={loadingCep} />
                <InputGroup id="address_number" label="Número" value={data.number} onChange={e => setData('number', e.target.value)} error={errors.number} />
                <InputGroup label="Bairro" value={data.neighborhood} onChange={e => setData('neighborhood', e.target.value)} error={errors.neighborhood} disabled={loadingCep} />
                <InputGroup label="Cidade" value={data.city} onChange={e => setData('city', e.target.value)} error={errors.city} disabled={loadingCep} />
                
                {/* 🛡️ Dropdown de UF Inteligente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UF (Estado)</label>
                    <select
                        value={data.state}
                        onChange={e => setData('state', e.target.value)}
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
                    {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancelar
                </button>
                <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
                    {processing ? 'Salvando...' : 'Confirmar'}
                </button>
            </div>
        </form>
    );
};

// ── TELA PRINCIPAL ──────────────────────────────────────────────────────────
export default function Index({ auth, adopters = [] }) {
    const [modalConfig, setModalConfig] = useState({ isOpen: false, data: null });
    const closeModal = () => setModalConfig({ isOpen: false, data: null });
    
    const [viewModal, setViewModal] = useState({ isOpen: false, data: null });

    const tableColumns = [
        { label: 'NOME', key: 'name', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
        { label: 'CPF', key: 'cpf', render: (val) => formatCPF(val) },
        { label: 'CONTATO', key: 'phone', render: (val, adopter) => (
            <div className="flex flex-col">
                <span>{formatPhone(val)}</span>
                <span className="text-xs text-gray-500">{adopter.email || 'Sem e-mail'}</span>
            </div>
        )},
        { label: 'LOCALIDADE', key: 'address', render: (_, adopter) => (
            <span className="text-gray-600">
                {adopter.address?.city} - {adopter.address?.state}
            </span>
        )},
        { label: 'AÇÕES', key: 'actions', render: (_, adopter) => (
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setViewModal({ isOpen: true, data: adopter })}
                    className="p-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                    title="Ver Histórico Completo"
                >
                    <HistoryIcon />
                </button>

                <button 
                    onClick={() => setModalConfig({ isOpen: true, data: adopter })}
                    className="p-2 bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors"
                    title="Editar"
                >
                    <EditIcon />
                </button>

                <Link 
                    href={route('adopters.destroy', adopter.id)} 
                    method="delete" as="button" 
                    onClick={(e) => {
                        if (!confirm(`Tem certeza que deseja excluir ${adopter.name}? Esta ação não pode ser desfeita.`)) e.preventDefault();
                    }} 
                    className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"
                    title="Excluir"
                >
                    <TrashIcon />
                </Link>
            </div>
        )}
    ];

    const searchFunction = (adopter, query) => {
        return (adopter.name || '').toLowerCase().includes(query) ||
               (adopter.cpf || '').includes(query) ||
               (adopter.address?.city || '').toLowerCase().includes(query);
    };

    const renderMobileCard = (adopter) => (
        <div key={adopter.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-gray-900">{adopter.name}</h3>
                    <p className="text-sm text-gray-500">{formatCPF(adopter.cpf)}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setViewModal({ isOpen: true, data: adopter })} className="text-amber-600 bg-amber-50 p-1.5 rounded-lg"><HistoryIcon /></button>
                    <button onClick={() => setModalConfig({ isOpen: true, data: adopter })} className="text-indigo-600 bg-indigo-50 p-1.5 rounded-lg"><EditIcon /></button>
                </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 flex flex-col gap-1.5">
                <p className="flex items-center gap-2">📍 {adopter.address?.city} - {adopter.address?.state}</p>
                <p className="flex items-center gap-2">📞 {formatPhone(adopter.phone)}</p>
            </div>
        </div>
    );

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Adoções <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Adotantes</span>
                </h2>
            }
        >
            <Head title="Gestão de Adotantes" />

            <DataBrowser 
                title="Adotantes Cadastrados"
                subtitle="Banco de dados de pessoas interessadas e aprovadas para adoção."
                data={adopters.data || adopters} 
                columns={tableColumns}
                renderMobileCard={renderMobileCard}
                onAddClick={() => setModalConfig({ isOpen: true, data: null })}
                addLabel="Novo Adotante"
                searchPlaceholder="Buscar por nome, CPF ou cidade..."
                searchFn={searchFunction}
            />

            {/* 🛡️ 1. MODAL DE CADASTRO E EDIÇÃO */}
            <BaseModal 
                isOpen={modalConfig.isOpen} 
                onClose={closeModal} 
                title={modalConfig.data ? 'Editar Adotante' : 'Cadastrar Adotante'}
            >
                {modalConfig.isOpen && (
                    <AdopterForm 
                        initialData={modalConfig.data} 
                        onSuccess={closeModal} 
                        onCancel={closeModal} 
                    />
                )}
            </BaseModal>

            {/* 🛡️ 2. MODAL DE DOSSIÊ/HISTÓRICO */}
            <BaseModal 
                isOpen={viewModal.isOpen} 
                onClose={() => setViewModal({ isOpen: false, data: null })}
                title={`Dossiê: ${viewModal.data?.name}`}
            >
                {viewModal.data && (
                    <div className="p-6 space-y-6 bg-gray-50/50">
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b pb-2">Informações Base</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <p><strong>CPF:</strong> {formatCPF(viewModal.data.cpf)}</p>
                                <p><strong>Telefone:</strong> {formatPhone(viewModal.data.phone)}</p>
                                <p className="col-span-1 sm:col-span-2"><strong>Endereço:</strong> {viewModal.data.address?.street}, {viewModal.data.address?.number} - {viewModal.data.address?.city}/{viewModal.data.address?.state}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                            <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 flex items-center gap-2 border-b border-amber-100/50 pb-2">
                                ⚠️ Histórico de Adoções / Devoluções
                            </h4>
                            
                            {viewModal.data.adoptions?.length > 0 ? (
                                <div className="space-y-3">
                                    {viewModal.data.adoptions.map(adoption => (
                                        <div key={adoption.id} className={`p-3 rounded-lg border ${adoption.returned_at ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                                    <span className="text-lg leading-none">🐾</span> {adoption.animal?.name}
                                                </span>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${adoption.returned_at ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                                    {adoption.returned_at ? 'Devolvido' : 'Adotado'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {adoption.returned_at 
                                                    ? `Devolução em: ${formatDate(adoption.returned_at)}` 
                                                    : `Adotado em: ${formatDate(adoption.adoption_date)}`}
                                            </p>
                                            {adoption.return_reason && (
                                                <div className="mt-2 text-xs italic text-red-700 bg-red-100/50 p-2 rounded-lg border border-red-100/50">
                                                    <strong>Motivo da devolução:</strong> {adoption.return_reason}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-amber-600 italic">Nenhum histórico de adoção registrado para este perfil.</p>
                            )}
                        </div>
                        <div className="flex justify-end pt-2">
                            <button onClick={() => setViewModal({ isOpen: false, data: null })} className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
                                Fechar
                            </button>
                        </div>
                    </div>
                )}
            </BaseModal>

        </AuthenticatedLayout>
    );
}