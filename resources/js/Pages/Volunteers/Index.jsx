import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import DataBrowser from '@/Components/DataBrowser';
import BaseModal from '@/Components/Modals/BaseModal';
import { ESTADOS_BR } from '@/lib/constants/address';

// ── Ícones Padronizados ─────────────────
const EditIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

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

export default function VolunteersIndex({ auth, volunteers }) {
    const [modalConfig, setModalConfig] = useState({ isOpen: false, isEditing: false, id: null });
    const [loadingCep, setLoadingCep] = useState(false);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        name: '', phone: '', email: '', emergency_available: false,
        skills: [], availability: [], notes: '', status: 'active',
        zip_code: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
    });

    const openModal = (v = null) => {
        if (v) {
            setData({
                ...v,
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

    const toggleArrayValue = (field, value) => {
        setData(prev => ({
            ...prev,
            [field]: prev[field].includes(value) 
                ? prev[field].filter(i => i !== value) 
                : [...prev[field], value]
        }));
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
                columns={[
                    { label: 'NOME', key: 'name', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
                    { label: 'CONTATO', key: 'phone' },
                    { label: 'HABILIDADES', key: 'skills', render: (val) => <div className="flex gap-1">{val?.map(s => <span key={s} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{SKILLS_OPTIONS.find(o => o.id === s)?.label || s}</span>)}</div> },
                    { label: 'AÇÕES', key: 'actions', render: (_, v) => (
                        <div className="flex justify-center gap-2">
                            <button onClick={() => openModal(v)} className="p-2 bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors"><EditIcon /></button>
                            <button onClick={() => handleDelete(v.id, v.name)} className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"><TrashIcon /></button>
                        </div>
                    )}
                ]}
                renderMobileCard={(v) => (
                    <div className="bg-white p-4 rounded-xl border shadow-sm flex flex-col gap-3">
                        <h3 className="font-bold">{v.name}</h3>
                        <p className="text-xs text-gray-500">{v.phone}</p>
                        <div className="flex gap-2">
                            <button onClick={() => openModal(v)} className="flex-1 bg-gray-100 py-2 rounded text-xs font-bold flex items-center justify-center gap-1"><EditIcon /> Editar</button>
                            <button onClick={() => handleDelete(v.id, v.name)} className="flex-1 bg-red-50 text-red-700 py-2 rounded text-xs font-bold flex items-center justify-center gap-1"><TrashIcon /> Excluir</button>
                        </div>
                    </div>
                )}
            />

            <BaseModal isOpen={modalConfig.isOpen} onClose={closeModal} title={modalConfig.isEditing ? 'Editar Voluntário' : 'Novo Voluntário'}>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Nome</label>
                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full rounded-lg border-gray-300" required />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full rounded-lg border-gray-300" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full rounded-lg border-gray-300" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Status</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value)} className="w-full rounded-lg border-gray-300">
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                            </select>
                        </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm font-bold">
                        <input type="checkbox" checked={data.emergency_available} onChange={e => setData('emergency_available', e.target.checked)} />
                        Disponível para emergências
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Habilidades</p>
                            <div className="flex flex-wrap gap-2">
                                {SKILLS_OPTIONS.map(opt => (
                                    <button type="button" key={opt.id} onClick={() => toggleArrayValue('skills', opt.id)} className={`px-2 py-1 rounded text-xs ${data.skills.includes(opt.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{opt.label}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase mb-2">Disponibilidade</p>
                            <div className="flex flex-wrap gap-2">
                                {AVAILABILITY_OPTIONS.map(opt => (
                                    <button type="button" key={opt.id} onClick={() => toggleArrayValue('availability', opt.id)} className={`px-2 py-1 rounded text-xs ${data.availability.includes(opt.id) ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>{opt.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="md:col-span-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">CEP {loadingCep && <span className="animate-pulse">...</span>}</label>
                            <input type="text" value={data.zip_code} onBlur={e => fetchCep(e.target.value)} onChange={e => setData('zip_code', e.target.value)} className="w-full rounded-lg border-gray-300" disabled={loadingCep} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Rua</label>
                            <input type="text" value={data.street} onChange={e => setData('street', e.target.value)} className="w-full rounded-lg border-gray-300" disabled={loadingCep} />
                        </div>
                        <div className="col-span-1"><label className="text-xs font-bold text-gray-500 uppercase">Nº</label><input type="text" value={data.number} onChange={e => setData('number', e.target.value)} className="w-full rounded-lg border-gray-300" /></div>
                        <div className="col-span-1"><label className="text-xs font-bold text-gray-500 uppercase">Compl.</label><input type="text" value={data.complement} onChange={e => setData('complement', e.target.value)} className="w-full rounded-lg border-gray-300" /></div>
                        <div className="col-span-1"><label className="text-xs font-bold text-gray-500 uppercase">Bairro</label><input type="text" value={data.neighborhood} onChange={e => setData('neighborhood', e.target.value)} className="w-full rounded-lg border-gray-300" disabled={loadingCep} /></div>
                        <div className="md:col-span-2 col-span-3"><label className="text-xs font-bold text-gray-500 uppercase">Cidade</label><input type="text" value={data.city} onChange={e => setData('city', e.target.value)} className="w-full rounded-lg border-gray-300" disabled={loadingCep} /></div>
                        <div className="col-span-3 md:col-span-1">
                            <label className="text-xs font-bold text-gray-500 uppercase">UF</label>
                            <select value={data.state} onChange={e => setData('state', e.target.value)} className="w-full rounded-lg border-gray-300" disabled={loadingCep}>
                                <option value="">UF</option>
                                {ESTADOS_BR.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                            </select>
                        </div>
                    </div>

                    <textarea placeholder="Notas" value={data.notes} onChange={e => setData('notes', e.target.value)} className="w-full rounded-lg border-gray-300" />
                    
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-100 rounded-lg">Cancelar</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Salvar</button>
                    </div>
                </form>
            </BaseModal>
        </AuthenticatedLayout>
    );
}