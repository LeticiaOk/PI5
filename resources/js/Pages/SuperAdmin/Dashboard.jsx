import { Head } from '@inertiajs/react';

export default function Dashboard({ ongs, adoptionLeads, totalMarketingOptIn }) {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 p-8 font-sans">
            <Head title="Super Admin - PlataformaX" />

            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex justify-between items-end border-b border-slate-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">Olimpo SaaS</h1>
                        <p className="text-slate-400 mt-1">Visão global de todas as ONGs e Leads da plataforma.</p>
                    </div>
                </header>

                {/* ── CARDS DE RESUMO ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total de ONGs</h3>
                        <p className="text-4xl font-black text-indigo-400 mt-2">{ongs.length}</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl">
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Leads de Adoção</h3>
                        <p className="text-4xl font-black text-emerald-400 mt-2">{adoptionLeads.length}</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">📢</div>
                        <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider">Aceitaram Marketing</h3>
                        <p className="text-4xl font-black text-amber-400 mt-2">{totalMarketingOptIn}</p>
                    </div>
                </div>

                {/* ── LISTA DE LEADS (Mala Direta) ── */}
                <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="text-xl font-bold text-white">Leads Capturados (Adoção)</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 text-slate-400">
                                <tr>
                                    <th className="p-4 font-semibold">Nome</th>
                                    <th className="p-4 font-semibold">E-mail</th>
                                    <th className="p-4 font-semibold">Telefone</th>
                                    <th className="p-4 font-semibold">ONG Origem</th>
                                    <th className="p-4 font-semibold">Marketing</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {adoptionLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 font-medium text-white">{lead.adopter_name}</td>
                                        <td className="p-4 text-slate-300">{lead.adopter_email}</td>
                                        <td className="p-4 text-slate-300">{lead.adopter_phone}</td>
                                        <td className="p-4 text-indigo-300 font-medium">
                                            {lead.ong ? lead.ong.name : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            {lead.accepts_marketing ? (
                                                <span className="inline-flex px-2 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400">Sim</span>
                                            ) : (
                                                <span className="inline-flex px-2 py-1 rounded text-xs font-bold bg-slate-700 text-slate-400">Não</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {adoptionLeads.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500">Nenhum lead registrado ainda.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}