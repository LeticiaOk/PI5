import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import DataBrowser from '@/Components/DataBrowser';
import BaseModal from '@/Components/Modals/BaseModal';
import { ESTADOS_BR } from '@/lib/constants/address';

// ── Ícones ──────────────────────────────────────────────────────────────────
const EditIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const AlertIcon = () => <svg className="w-4 h-4 text-red-500 inline ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const UserIcon = () => <svg className="w-6 h-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;

const SKILLS_OPTIONS = [
    { id: 'veterinario', label: 'Veterinário(a)' },
    { id: 'transporte', label: 'Transporte/Resgate' },
    { id: 'lar_temporario', label: 'Lar Temporário' },
    { id: 'fotografia', label: 'Fotografia' },
    { id: 'eventos', label: 'Eventos/Feiras' },
    { id: 'administrativo', label: 'Administrativo' },
];

const AVAILABILITY_OPTIONS = [
    { id: 'weekdays', label: 'Dias de Semana' },
    { id: 'weekends', label: 'Finais de Semana' },
    { id: 'nights', label: 'Período Noturno' },
];

const formatPhoneView = (phone) => {
    if (!phone) return '—';
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

export default function VolunteersIndex({ auth, volunteers }) {
    const [modalConfig, setModalConfig] = useState({ isOpen: false, isEditing: false, id: null });
    const [loadingCep, setLoadingCep] = useState(false);

    // 🛡️ CHAVES RESTAURADAS PARA EVITAR ERRO 500 NO LARAVEL
    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        name: '', phone: '', email: '', emergency_available: false,
        skills: [], availability: [], notes: '', status: 'active',
        zip_code: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
    });

    const openModal = (v = null) => {
        if (v) {
            setData({
                ...v,
                email: v.email || '',
                notes: v.notes || '',
                status: v.status || 'active',
                skills: v.skills || [],
                availability: v.availability || [],
                zip_code: v.address?.zip_code || '',
                street: v.address?.street || '',
                number: v.address?.number || '',
                complement: v.address?.complement || '',
                neighborhood: v.address?.neighborhood || '',
                city: v.address?.city || '',
                state: v.address?.state || '',
            });
            setModalConfig({ isOpen: true, isEditing: true, id: v.id });
        } else {
            reset();
            setModalConfig({ isOpen: true, isEditing: false, id: null });
        }
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, isEditing: false, id: null });
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (modalConfig.isEditing) put(route('volunteers.update', modalConfig.id), { onSuccess: () => closeModal() });
        else post(route('volunteers.store'), { onSuccess: () => closeModal() });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Tem certeza absoluta que deseja excluir o voluntário "${name}"? Esta ação não pode ser desfeita.`)) {
            destroy(route('volunteers.destroy', id), { preserveScroll: true });
        }
    };

    const handlePhoneChange = (e) => {
        let v = e.target.value.replace(/\D/g, '');
        v = v.substring(0, 11);
        if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
        else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
        else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        else if (v.length > 0) v = v.replace(/^(\d{0,2})/, '($1');
        setData('phone', v);
    };

    const handleCheckboxArray = (e, field) => {
        const { value, checked } = e.target;
        if (checked) {
            setData(field, [...data[field], value]);
        } else {
            setData(field, data[field].filter((item) => item !== value));
        }
    };

    const fetchCep = async (cepValue) => {
        const cep = cepValue.replace(/\D/g, ''); 
        if (cep.length !== 8) return;
        setLoadingCep(true);
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json());
            if (!res.erro) {
                setData(d => ({ ...d, street: res.logradouro, neighborhood: res.bairro, city: res.localidade, state: res.uf, zip_code: cep }));
            }
        } catch (e) { alert('Erro ao buscar CEP'); } finally { setLoadingCep(false); }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-sm font-medium text-gray-500">Rede de Apoio / <span className="text-gray-900 font-semibold">Voluntários</span></h2>}>
            <Head title="Voluntários" />

            <DataBrowser 
                title="Voluntários"
                subtitle="Catálogo de talentos e rede de apoio."
                data={volunteers.data || volunteers}
                onAddClick={() => openModal()}
                addLabel="Novo Voluntário"
                searchPlaceholder="Buscar por nome ou contato..."
                searchFn={(v, q) => (v.name||'').toLowerCase().includes(q) || (v.phone||'').includes(q)}
                columns={[
                    { label: 'NOME', key: 'name', render: (_, v) => (
                        <span className="font-bold text-gray-900 flex items-center">
                            {v.name} {v.emergency_available && <AlertIcon />}
                        </span>
                    )},
                    { label: 'CONTATO', key: 'phone', render: (val) => formatPhoneView(val) },
                    { label: 'HABILIDADES', key: 'skills', render: (val) => (
                        <div className="flex flex-wrap gap-1">
                            {val?.map(s => <span key={s} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-wider">{SKILLS_OPTIONS.find(o => o.id === s)?.label || s}</span>)}
                        </div>
                    )},
                    { label: 'AÇÕES', key: 'actions', render: (_, v) => (
                        <div className="flex justify-center gap-2">
                            <button onClick={() => openModal(v)} className="p-2 bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors"><EditIcon /></button>
                            <button onClick={() => handleDelete(v.id, v.name)} className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"><TrashIcon /></button>
                        </div>
                    )}
                ]}
                renderMobileCard={(v) => (
                    <div key={v.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start gap-2">
                            <div className="flex gap-3 items-center">
                                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                                    <UserIcon />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                                        {v.name} {v.emergency_available && <AlertIcon />}
                                    </h3>
                                    <p className="text-sm text-gray-500">{formatPhoneView(v.phone)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 items-end">
                                <div className="flex gap-1.5">
                                    <button onClick={() => openModal(v)} className="p-2 bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors"><EditIcon /></button>
                                    <button onClick={() => handleDelete(v.id, v.name)} className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"><TrashIcon /></button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                            <span className="text-sm text-gray-600">📍 {v.address?.city && v.address?.state ? `${v.address.city} - ${v.address.state}` : 'Local não informado'}</span>
                            {v.skills && v.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {v.skills.map(s => <span key={s} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold uppercase">{SKILLS_OPTIONS.find(o => o.id === s)?.label || s}</span>)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            />

            <BaseModal isOpen={modalConfig.isOpen} onClose={closeModal} title={modalConfig.isEditing ? 'Editar Voluntário' : 'Novo Voluntário'}>
                <form onSubmit={submit} className="p-2 space-y-8">
                    
                    {/* Bloco 1: Dados Pessoais */}
                    <div>
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Informações Básicas</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telefone</label>
                                <input type="text" placeholder="(11) 99999-9999" maxLength={15} value={data.phone} onChange={handlePhoneChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Bloco 2: Tags JSON (Skills e Disponibilidade) */}
                    <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Perfil de Ajuda</h4>
                        
                        <label className="flex items-center p-3 bg-red-50/50 border border-red-100 rounded-lg cursor-pointer mb-6 w-full">
                            <input type="checkbox" checked={data.emergency_available} onChange={e => setData('emergency_available', e.target.checked)} className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500 w-4 h-4" />
                            <span className="ml-3 font-semibold text-red-600 text-sm">Disponível para Resgates/Emergências (Fora de hora)</span>
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Habilidades (Skills)</label>
                                <div className="space-y-3">
                                    {SKILLS_OPTIONS.map(skill => (
                                        <label key={skill.id} className="flex items-center cursor-pointer">
                                            <input type="checkbox" value={skill.id} checked={data.skills.includes(skill.id)} onChange={(e) => handleCheckboxArray(e, 'skills')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 mr-3" />
                                            <span className="text-sm text-gray-600">{skill.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Disponibilidade Geral</label>
                                <div className="space-y-3">
                                    {AVAILABILITY_OPTIONS.map(opt => (
                                        <label key={opt.id} className="flex items-center cursor-pointer">
                                            <input type="checkbox" value={opt.id} checked={data.availability.includes(opt.id)} onChange={(e) => handleCheckboxArray(e, 'availability')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 mr-3" />
                                            <span className="text-sm text-gray-600">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bloco 3: Endereço (ViaCEP) */}
                    <div className="pt-6 border-t border-gray-100">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Localização</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CEP {loadingCep && <span className="animate-pulse text-indigo-500">...</span>}</label>
                                <input type="text" maxLength={9} placeholder="00000-000" value={data.zip_code} onBlur={e => fetchCep(e.target.value)} onChange={e => {
                                    let v = e.target.value.replace(/\D/g, '');
                                    if(v.length > 5) v = v.replace(/^(\d{5})(\d)/, '$1-$2');
                                    setData('zip_code', v);
                                }} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                {errors.zip_code && <div className="text-red-500 text-xs mt-1">{errors.zip_code}</div>}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rua/Logradouro</label>
                                <input type="text" value={data.street} onChange={e => setData('street', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-6 gap-6">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                <input type="text" value={data.number} onChange={e => setData('number', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                            </div>
                            <div className="sm:col-span-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                                <input type="text" value={data.neighborhood} onChange={e => setData('neighborhood', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                <input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                            </div>
                            <div className="sm:col-span-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                                <select value={data.state} onChange={e => setData('state', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
                                    <option value="">--</option>
                                    {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-6">
                        <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancelar</button>
                        <button type="submit" disabled={processing} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50">
                            {processing ? 'Salvando...' : 'Salvar Voluntário'}
                        </button>
                    </div>
                </form>
            </BaseModal>
        </AuthenticatedLayout>
    );
}