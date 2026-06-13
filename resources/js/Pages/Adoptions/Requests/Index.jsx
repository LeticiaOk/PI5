import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, requests }) {
    // Sanitização para o WhatsApp
    const getWhatsAppLink = (phone) => {
        if (!phone) return '#';
        let cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
            cleanPhone = `55${cleanPhone}`;
        }
        return `https://wa.me/${cleanPhone}`;
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Adoções <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Interessados</span>
                </h2>
            }
        >
            <Head title="Interessados em Adoção" />

            <div className="py-6 sm:py-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Cabeçalho da Página */}
                <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Interessados em Adoção</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">Gerencie as solicitações de interessados em adoção.</p>
                    </div>
                </div>

                {/* VISÃO DESKTOP: Tabela Tradicional */}
                <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-6">Candidato</th>
                                    <th className="py-4 px-6">Contato</th>
                                    <th className="py-4 px-6">Animal</th>
                                    <th className="py-4 px-6">Status</th>
                                    <th className="py-4 px-6 text-right">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                                            Nenhum interessado encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((req) => (
                                        <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">{req.adopter_name}</td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-600">{req.adopter_email}</div>
                                                <a 
                                                    href={getWhatsAppLink(req.adopter_phone)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline flex items-center gap-1 mt-1 w-max"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                                                    {req.adopter_phone}
                                                </a>
                                            </td>
                                            <td className="py-4 px-6">
                                                {req.animal ? (
                                                    <Link 
                                                        href={`/animals/${req.animal.id}?from=requests`}
                                                        className="text-blue-600 hover:text-blue-800 hover:underline font-bold text-sm flex items-center gap-1 w-max"
                                                        title="Ver Dossiê do Animal"
                                                    >
                                                        {req.animal.name}
                                                        <svg className="w-3.5 h-3.5 mt-0.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                                    </Link>
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic border border-gray-200 bg-gray-50 px-2 py-1 rounded">Animal Removido</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md border tracking-wider
                                                    ${req.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                                    ${req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                                    ${req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                                `}>
                                                    {req.status === 'pending' ? 'Pendente' : req.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right text-gray-500 whitespace-nowrap">
                                                {new Date(req.created_at).toLocaleDateString('pt-BR')}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* VISÃO MOBILE: Cards Responsivos */}
                <div className="block md:hidden space-y-4">
                    {requests.data.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 bg-white rounded-xl border border-gray-200 shadow-sm">
                            Nenhum interessado no momento.
                        </div>
                    ) : (
                        requests.data.map((req) => (
                            <div key={req.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                                <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight text-sm">{req.adopter_name}</h3>
                                        <span className="text-xs text-gray-500">{new Date(req.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md border tracking-wider shrink-0
                                        ${req.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                        ${req.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        ${req.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                    `}>
                                        {req.status === 'pending' ? 'Pendente' : req.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 gap-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Contato</span>
                                        <a href={getWhatsAppLink(req.adopter_phone)} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 mb-1 flex items-center gap-1 w-max">
                                            {req.adopter_phone}
                                        </a>
                                        <span className="block text-xs text-gray-500">{req.adopter_email}</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    {req.animal ? (
                                        <Link href={`/animals/${req.animal.id}?from=requests`} className="w-full justify-center text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-2.5 rounded-lg border border-indigo-200 flex items-center gap-1 transition-colors">
                                            VER PERFIL DO {req.animal.name.toUpperCase()}
                                        </Link>
                                    ) : (
                                        <span className="w-full block text-center text-[10px] font-bold text-gray-400 uppercase bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200">
                                            Animal Removido
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}