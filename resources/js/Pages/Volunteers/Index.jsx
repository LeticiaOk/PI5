import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

// Dicionários para as nossas Tags JSON
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

// Ícones
const AlertIcon = () => <svg className="w-4 h-4 text-red-500 inline mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const PhoneIcon = () => <svg className="w-4 h-4 inline mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const LocationIcon = () => <svg className="w-4 h-4 inline mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

export default function VolunteersIndex({ auth, volunteers }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors, processing } = useForm({
        name: '', phone: '', email: '', emergency_available: false,
        skills: [], availability: [], notes: '', status: 'active',
        zip_code: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
    });

    const openModal = (volunteer = null) => {
        if (volunteer) {
            setEditingId(volunteer.id);
            setData({
                ...volunteer,
                zip_code: volunteer.address?.zip_code || '',
                street: volunteer.address?.street || '',
                number: volunteer.address?.number || '',
                complement: volunteer.address?.complement || '',
                neighborhood: volunteer.address?.neighborhood || '',
                city: volunteer.address?.city || '',
                state: volunteer.address?.state || '',
            });
        } else {
            setEditingId(null);
            reset();
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route('volunteers.update', editingId), { onSuccess: () => closeModal() });
        } else {
            post(route('volunteers.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Tem certeza que deseja excluir o voluntário ${name}?`)) {
            destroy(route('volunteers.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const handleCheckboxArray = (e, field) => {
        const { value, checked } = e.target;
        if (checked) {
            setData(field, [...data[field], value]);
        } else {
            setData(field, data[field].filter((item) => item !== value));
        }
    };

    const fetchCep = async (cep) => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const result = await response.json();
                
                if (!result.erro) {
                    setData(prevData => ({
                        ...prevData,
                        street: result.logradouro || '',
                        neighborhood: result.bairro || '',
                        city: result.localidade || '',
                        state: result.uf || '',
                        zip_code: cleanCep 
                    }));
                } else {
                    alert('CEP não encontrado na base do ViaCEP.');
                }
            } catch (error) {
                console.error("Erro ao buscar CEP externamente", error);
                alert('Não foi possível conectar ao serviço de CEP.');
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Rede de Voluntários</h2>}>
            <Head title="Voluntários" />

            <div className="py-6 sm:py-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Cabeçalho de Ações Adaptativo */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 hidden sm:block">Voluntários</h1>
                        <p className="text-gray-500 text-sm mt-1">Catálogo de talentos e rede de apoio para emergências.</p>
                    </div>
                    <button onClick={() => openModal()} className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-sm transition-colors flex justify-center items-center gap-2">
                        <span>+ Adicionar Voluntário</span>
                    </button>
                </div>

                {/* 👇 VISÃO DESKTOP: Tabela Tradicional */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
                    <table className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 uppercase tracking-wider text-gray-500 text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Voluntário</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Habilidades</th>
                                <th className="px-6 py-4">Localização</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {volunteers.data.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Nenhum voluntário cadastrado.</td></tr>
                            ) : (
                                volunteers.data.map((vol) => (
                                    <tr key={vol.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 flex items-center">
                                                {vol.name}
                                                {vol.emergency_available && <span title="Disponível para Emergências" className="ml-2"><AlertIcon /></span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{vol.phone}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {vol.skills?.map(skill => (
                                                    <span key={skill} className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold uppercase">
                                                        {SKILLS_OPTIONS.find(s => s.id === skill)?.label || skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {vol.address ? `${vol.address.city} - ${vol.address.state}` : '—'}
                                        </td>
                                        {/* 👇 AQUI: Botões de Editar e Excluir na Tabela Desktop */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button onClick={() => openModal(vol)} className="text-indigo-600 font-bold hover:underline">Editar</button>
                                                <button onClick={() => handleDelete(vol.id, vol.name)} className="text-red-600 font-bold hover:underline">Excluir</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 👇 VISÃO MOBILE: Cards Responsivos */}
                <div className="block md:hidden space-y-4">
                    {volunteers.data.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 bg-white rounded-xl border border-gray-100 shadow-sm">
                            Nenhum voluntário cadastrado.
                        </div>
                    ) : (
                        volunteers.data.map((vol) => (
                            <div key={vol.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                                
                                {/* Header do Card */}
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                        {vol.name}
                                        {vol.emergency_available && <span title="Disponível para Emergências"><AlertIcon /></span>}
                                    </h3>
                                </div>

                                {/* Info Box (Telefone e Endereço) */}
                                <div className="text-sm text-gray-700 flex flex-col gap-2 bg-gray-50 p-3.5 rounded-lg border border-gray-100">
                                    <p className="flex items-center font-medium">
                                        <PhoneIcon /> {vol.phone}
                                    </p>
                                    <p className="flex items-center text-gray-500">
                                        <LocationIcon /> {vol.address ? `${vol.address.city} - ${vol.address.state}` : 'Local não informado'}
                                    </p>
                                </div>

                                {/* Skills / Habilidades */}
                                {vol.skills && vol.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {vol.skills.map(skill => (
                                            <span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                                {SKILLS_OPTIONS.find(s => s.id === skill)?.label || skill}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* 👇 AQUI: Botões de Editar e Excluir no Card Mobile */}
                                <div className="pt-3 border-t border-gray-100 mt-1 flex gap-2">
                                    <button 
                                        onClick={() => openModal(vol)} 
                                        className="flex-1 text-center px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(vol.id, vol.name)} 
                                        className="flex-1 text-center px-4 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
            
            {/* 📝 MODAL DE CADASTRO / EDIÇÃO */}
            {modalOpen && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-gray-900/50 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl relative flex flex-col max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        
                        {/* HEADER FIXO COM O "X" */}
                        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl z-10 shrink-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900">{editingId ? 'Editar Voluntário' : 'Novo Voluntário'}</h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-900 p-2 -mr-2 text-2xl leading-none transition-colors">
                                &times;
                            </button>
                        </div>
                        
                        {/* CORPO ROLÁVEL (O formulário) */}
                        <div className="overflow-y-auto p-4 sm:p-6">
                            <form onSubmit={submit} className="space-y-8" id="volunteer-form">
                                {/* Bloco 1: Dados Pessoais */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Informações Básicas</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nome</label>
                                            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">WhatsApp / Telefone</label>
                                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                            {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Bloco 2: Tags JSON (Skills e Disponibilidade) */}
                                <div className="bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-6 border-y border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Perfil de Ajuda</h4>
                                    
                                    <div className="mb-6">
                                        <label className="flex items-start sm:items-center p-3 bg-red-50 border border-red-100 rounded-lg cursor-pointer hover:bg-red-100 transition-colors">
                                            <input type="checkbox" checked={data.emergency_available} onChange={e => setData('emergency_available', e.target.checked)} className="rounded border-gray-300 text-red-600 shadow-sm focus:ring-red-500 w-5 h-5 mt-0.5 sm:mt-0" />
                                            <span className="ml-3 font-bold text-red-800 text-sm leading-tight">Disponível para Resgates/Emergências (Fora de hora)</span>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Habilidades (Skills)</label>
                                            <div className="space-y-3">
                                                {SKILLS_OPTIONS.map(skill => (
                                                    <label key={skill.id} className="flex items-center text-sm text-gray-600 cursor-pointer">
                                                        <input type="checkbox" value={skill.id} checked={data.skills.includes(skill.id)} onChange={(e) => handleCheckboxArray(e, 'skills')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 mr-3" />
                                                        {skill.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-3">Disponibilidade Geral</label>
                                            <div className="space-y-3">
                                                {AVAILABILITY_OPTIONS.map(opt => (
                                                    <label key={opt.id} className="flex items-center text-sm text-gray-600 cursor-pointer">
                                                        <input type="checkbox" value={opt.id} checked={data.availability.includes(opt.id)} onChange={(e) => handleCheckboxArray(e, 'availability')} className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 mr-3" />
                                                        {opt.label}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bloco 3: Endereço (ViaCEP) */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Localização</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">CEP</label>
                                            <input type="text" value={data.zip_code} onBlur={(e) => fetchCep(e.target.value)} onChange={e => setData('zip_code', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                            {errors.zip_code && <div className="text-red-500 text-xs mt-1">{errors.zip_code}</div>}
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Rua/Logradouro</label>
                                            <input type="text" value={data.street} onChange={e => setData('street', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50" readOnly required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Número</label>
                                            <input type="text" value={data.number} onChange={e => setData('number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-sm font-medium text-gray-700">Bairro</label>
                                            <input type="text" value={data.neighborhood} onChange={e => setData('neighborhood', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50" readOnly required />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        {/* FOOTER FIXO (Ações) */}
                        <div className="p-4 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50 rounded-b-2xl shrink-0">
                            <button type="button" onClick={closeModal} className="w-full sm:w-auto px-6 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl font-bold transition-colors">Cancelar</button>
                            <button form="volunteer-form" type="submit" disabled={processing} className="w-full sm:w-auto px-6 py-2.5 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold disabled:opacity-50 transition-colors shadow-sm">
                                {processing ? 'Salvando...' : 'Salvar Voluntário'}
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}