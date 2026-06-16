import React from 'react';
import { Head, Link } from '@inertiajs/react';
import DataBrowser from '@/Components/DataBrowser';

// Helper para formatar celular na visualização
const formatPhoneView = (phone) => {
    if (!phone) return '—';
    return phone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const getWhatsAppLink = (phone) => {
    if (!phone) return '#';

    const cleaned = phone.replace(/\D/g, '');

    return `https://wa.me/55${cleaned}`;
};

const WhatsAppIcon = () => (
    <svg
        className="w-4 h-4"
        fill="currentColor"
        viewBox="0 0 24 24"
    >
        <path d="M20.52 3.48A11.82 11.82 0 0012.07 0C5.52 0 .19 5.33.19 11.88c0 2.09.54 4.12 1.58 5.91L0 24l6.39-1.68a11.84 11.84 0 005.68 1.45h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.23-6.14-3.44-8.4zM12.08 21.8h-.01a9.87 9.87 0 01-5.03-1.37l-.36-.21-3.79 1 1.01-3.69-.24-.38a9.86 9.86 0 01-1.52-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 012.9 6.99c0 5.46-4.44 9.9-9.89 9.9zm5.43-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.48-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.53.08-.8.38-.27.3-1.03 1-1.03 2.43s1.05 2.81 1.2 3c.15.2 2.05 3.13 4.97 4.39.69.3 1.23.48 1.65.62.69.22 1.31.19 1.81.12.55-.08 1.77-.72 2.02-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z"/>
    </svg>
);

// Ícone de Logout
const LogoutIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default function Dashboard({ ongs, adoptionLeads, totalMarketingOptIn, landingLeads }) {
    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-12">
            <Head title="Super Admin | Foursters" />

            {/* ── HEADER SUPER ADMIN (Fundo Escuro, Logo e Breadcrumbs) ── */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        
                        {/* 1. SUA LOGO OFICIAL (Ajustada para h-10 para caber dentro do Header) */}
                        <img
                            src="/images/logo.png"
                            alt="Foursters"
                            className="h-10 w-auto object-contain transition-transform hover:scale-105"
                        />
                        
                        {/* 2. BREADCRUMBS SAAS */}
                        <nav className="hidden sm:flex items-center text-sm font-medium text-gray-500 border-l border-gray-300 pl-6 h-8">
                        <span className="text-gray-900 font-bold tracking-wide">Administração</span>
                            <svg className="w-4 h-4 mx-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            <span className="text-gray-700">Painel Global</span>
                        </nav>

                    </div>
                    
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg border border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"                    >
                        <LogoutIcon /> Sair
                    </Link>
                </div>
            </header>

            <main className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
                
                {/* ── CARDS DE RESUMO (Dark UI combinando com o fundo) ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-lg flex flex-col justify-center">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total de ONGs Ativas</h3>
                        <p className="text-4xl font-black text-indigo-400 mt-2">{ongs.length}</p>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-2xl shadow-lg flex flex-col justify-center">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Leads de Adoção (Global)</h3>
                        <p className="text-4xl font-black text-emerald-400 mt-2">{adoptionLeads.length}</p>
                    </div>
                    <div className="bg-gray-50 border-gray-200 p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-center">
                        <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">Aceitaram Marketing</h3>
                        <p className="text-4xl font-black text-amber-400 mt-2">{totalMarketingOptIn}</p>
                        <div className="absolute -bottom-1 -right-1 text-5xl opacity-30">📢</div>
                    </div>
                </div>

                {/* ── EMBALAGEM BRANCA PARA OS DATABROWSERS ── */}
                
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200">
                    <DataBrowser
                        title="Interessados na Plataforma"
                        subtitle="Pessoas e ONGs que solicitaram convite pela Landing Page oficial."
                        data={landingLeads}
                        onAddClick={null}
                        searchPlaceholder="Buscar lead por nome ou ONG..."
                        searchFn={(v, q) => (v.name||'').toLowerCase().includes(q) || (v.ong_name||'').toLowerCase().includes(q)}
                        columns={[
                            { label: 'NOME', key: 'name', render: (_, v) => <span className="font-bold text-gray-900">{v.name}</span> },
                            { label: 'ONG / PROJETO', key: 'ong_name', render: (_, v) => <span className="text-gray-900 font-medium">{v.ong_name || 'Não informado'}</span> },
                            { label: 'E-MAIL', key: 'email', render: (_, v) => <span className="text-gray-900">{v.email}</span> },
                            {
                                label: 'WHATSAPP',
                                key: 'phone',
                                render: (_, v) => (
                                    <a
                                        href={getWhatsAppLink(v.phone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                                    >
                                        <WhatsAppIcon />
                                        {formatPhoneView(v.phone)}
                                    </a>
                                )
                            },
                                                                                    { label: 'STATUS', key: 'status', render: (_, v) => (
                                <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    v.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    v.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                    'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {v.status === 'pending' ? 'Pendente' : v.status === 'contacted' ? 'Em Contato' : 'Convertido'}
                                </span>
                            )}
                        ]}
                        renderMobileCard={(v) => (
                            <div key={v.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900">{v.name}</h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                        v.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        v.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {v.status === 'pending' ? 'Pendente' : v.status === 'contacted' ? 'Em Contato' : 'Convertido'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">ONG: {v.ong_name || 'Não informada'}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                    <p>{formatPhoneView(v.phone)}</p>
                                    <p>{v.email}</p>
                                </div>
                            </div>
                        )}
                    />
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 mt-8">
                    <DataBrowser
                        title="Funil de Adoção (Visão Global)"
                        subtitle="Adotantes capturados por todas as vitrines da plataforma."
                        data={adoptionLeads}
                        onAddClick={null}
                        searchPlaceholder="Buscar por nome ou email..."
                        searchFn={(v, q) => (v.adopter_name||'').toLowerCase().includes(q) || (v.adopter_email||'').toLowerCase().includes(q)}
                        columns={[
                            { label: 'NOME DO ADOTANTE', key: 'adopter_name', render: (_, v) => <span className="font-bold text-gray-900">{v.adopter_name}</span> },
                            
                            // 🔥 E-MAIL RESTAURADO
                            { label: 'E-MAIL', key: 'adopter_email', render: (_, v) => <span className="text-gray-500">{v.adopter_email}</span> },
                            
                            { label: 'ONG DE ORIGEM', key: 'ong', render: (_, v) => <span className="text-indigo-600 font-bold">{v.ong ? v.ong.name : 'ONG Deletada'}</span> },
                            {
                                label: 'WHATSAPP',
                                key: 'adopter_phone',
                                render: (_, v) => (
                                    <a
                                        href={getWhatsAppLink(v.adopter_phone)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                                >
                                        <WhatsAppIcon />
                                        {formatPhoneView(v.adopter_phone)}
                                    </a>
                                )
                            },
                            { label: 'MARKETING', key: 'marketing', render: (_, v) => (
                                v.accepts_marketing ? (
                                    <span className="inline-flex px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Sim</span>
                                ) : (
                                    <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Não</span>
                                )
                            )}
                        ]}
                        renderMobileCard={(v) => (
                            <div key={v.id} className="bg-gray-50 rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-2">
                                <h3 className="font-bold text-gray-900">{v.adopter_name}</h3>
                                <p className="text-sm text-indigo-600 font-bold">Origem: {v.ong ? v.ong.name : 'ONG Deletada'}</p>
                                
                                {/* 🔥 E-MAIL RESTAURADO NO MOBILE */}
                                <div className="text-sm text-gray-500 mt-1">
                                    <p>{formatPhoneView(v.adopter_phone)}</p>
                                    <p>{v.adopter_email}</p>
                                </div>
                                
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                    {v.accepts_marketing ? (
                                        <span className="inline-flex px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Marketing: Sim</span>
                                    ) : (
                                        <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">Marketing: Não</span>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </div>

            </main>
        </div>
    );
}