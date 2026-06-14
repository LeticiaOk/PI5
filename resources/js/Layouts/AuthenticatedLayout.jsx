import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// ── Ícones (SVGs inline e locais) ─────────────────────────────────────────────
const PawIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM7 5.5a2 2 0 110 4 2 2 0 010-4zm10 0a2 2 0 110 4 2 2 0 010-4zM4.5 11a2 2 0 110 4 2 2 0 010-4zm15 0a2 2 0 110 4 2 2 0 010-4zM12 10c2.5 0 5 2 5 5 0 2-1.5 4-5 4s-5-2-5-4c0-3 2.5-5 5-5z" />
    </svg>
);
const IconAnimais = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" d="M9 3a3 3 0 00-3 3c0 1.5.8 2.7 2 3.3M15 3a3 3 0 013 3c0 1.5-.8 2.7-2 3.3M6.5 10.5C5 11.5 4 13 4 15c0 3 3.5 6 8 6s8-3 8-6c0-2-1-3.5-2.5-4.5" /></svg>
);
const IconAdocoes = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const IconLares = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const IconInsumos = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
);
const IconVoluntarios = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);
const IconSettings = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h-8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const IconChevron = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
);
const IconSair = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);
const IconHamburger = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
);
const IconClose = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
);

function NavLink({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {icon && <span className={active ? 'text-white' : 'text-gray-400'}>{icon}</span>}
            {label}
        </Link>
    );
}

export default function AuthenticatedLayout({ user, header, children }) {
    const { url } = usePage();
    const baseUrl = url.split('?')[0];

    const [insumosOpen, setInsumosOpen] = useState(baseUrl.startsWith('/insumos') || baseUrl.startsWith('/inventory'));
    const [adocoesOpen, setAdocoesOpen] = useState(baseUrl.startsWith('/adoptions') || baseUrl.startsWith('/adopters'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [url]);

    const isActive = (path) => {
        const cleanUrl = url.split('?')[0];
        return path === '/' ? cleanUrl === '/' : cleanUrl.startsWith(path);
    };

    const renderNavItems = () => (
        <>
            <NavLink href="/animals" icon={<IconAnimais />} label="Animais" active={isActive('/animals')} />
            <NavLink href="/temporary-homes" icon={<IconLares />} label="Lares temporários" active={isActive('/temporary-homes')} />

            <div>
                <button
                    onClick={() => setAdocoesOpen((o) => !o)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive('/adoptions') || isActive('/adopters') || isActive('/adoptions/requests')
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <span className="flex items-center gap-3">
                        <span className={isActive('/adoptions') || isActive('/adopters') || isActive('/adoptions/requests') ? 'text-white' : 'text-gray-400'}>
                            <IconAdocoes />
                        </span>
                        Adoções
                    </span>
                    <IconChevron open={adocoesOpen} />
                </button>

                {adocoesOpen && (
                    <div className="ml-8 mt-1 space-y-0.5">
                        <NavLink href="/adoptions/requests" icon={null} label="Interessados" active={isActive('/adoptions/requests')} />
                        <NavLink href="/adopters" icon={null} label="Adotantes" active={isActive('/adopters')} />
                        <NavLink href="/adoptions" icon={null} label="Animais Adotados" active={url.split('?')[0] === '/adoptions'} />
                    </div>
                )}
            </div>
            
            <div>
                <button
                    onClick={() => setInsumosOpen((o) => !o)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive('/insumos') || isActive('/inventory')
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                    <span className="flex items-center gap-3">
                        <span className={isActive('/insumos') || isActive('/inventory') ? 'text-white' : 'text-gray-400'}>
                            <IconInsumos />
                        </span>
                        Insumos
                    </span>
                    <IconChevron open={insumosOpen} />
                </button>

                {insumosOpen && (
                    <div className="ml-8 mt-1 space-y-0.5">
                        <NavLink 
                            href={route('inventory.food')} 
                            icon={null} 
                            label="Ração" 
                            active={route().current('inventory.food')} 
                        />
                        <NavLink 
                            href={route('inventory.medications')} 
                            icon={null} 
                            label="Medicamentos" 
                            active={route().current('inventory.medications')} 
                        />
                        <NavLink 
                            href={route('inventory.hygiene')} 
                            icon={null} 
                            label="Higiene" 
                            active={route().current('inventory.hygiene')} 
                        />
                        <NavLink 
                            href={route('inventory.cleaning')} 
                            icon={null} 
                            label="Limpeza" 
                            active={route().current('inventory.cleaning')} 
                        />
                    </div>
                )}
            </div>

            <NavLink href="/volunteers" icon={<IconVoluntarios />} label="Voluntários" active={isActive('/volunteers')} />

            <div className="mt-4 pt-4 border-t border-gray-100">
                <NavLink 
                    href={route('tenant.settings.edit')} 
                    icon={<IconSettings />} 
                    label="Visual do Site" 
                    active={route().current('tenant.settings.edit')} 
                />
            </div>
        </>
    );

    // Renderiza a assinatura (watermark) do SaaS
    const renderAssinaturaSistema = () => (
    <div className="mb-3 flex items-center justify-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
        <span className="text-[11px] text-gray-400 font-medium">
            Desenvolvido por
        </span>
        <span className="text-[11px] font-black text-gray-900 tracking-tight">
            4Fosters
        </span>
    </div>
);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Header Mobile */}
            <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 z-30 relative">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white overflow-hidden shrink-0">
                       {user?.ong?.logo_path ? (
    <img 
        src={user.ong.logo_path} // Removi o /storage/ daqui, pois já vem do banco
        alt="Logo da Instituição" 
        className="w-full h-full object-cover" 
        onError={(e) => { e.target.style.display = 'none'; }} // Se a imagem falhar, esconde
    />
) : (
    <PawIcon />
)}
                    </div>
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[150px]">
                        {user?.ong?.name || 'Logo'}
                    </span>
                </div>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none">
                    {mobileMenuOpen ? <IconClose /> : <IconHamburger />}
                </button>
            </header>

            {/* Menu Mobile Expandido */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-[57px] left-0 w-full bg-white border-b border-gray-100 shadow-lg z-20 flex flex-col max-h-[calc(100vh-57px)] overflow-y-auto">
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {renderNavItems()}
                    </nav>
                    <div className="px-4 py-4 border-t border-gray-100 bg-gray-50/50">

                      {renderAssinaturaSistema()}

                        <Link href={route('logout')} method="post" as="button" className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150 border border-gray-200 bg-white">
                            <span className="text-gray-400"><IconSair /></span> Sair
                        </Link>
                      
                    </div>
                </div>
            )}

            {/* Sidebar Desktop */}
            <aside className="hidden md:flex w-[240px] flex-shrink-0 bg-white border-r border-gray-100 flex-col h-full z-10">
                <div className="px-4 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
                           {user?.ong?.logo_path ? (
    <img 
        src={user.ong.logo_path} // Removi o /storage/ daqui, pois já vem do banco
        alt="Logo da Instituição" 
        className="w-full h-full object-cover" 
        onError={(e) => { e.target.style.display = 'none'; }} // Se a imagem falhar, esconde
    />
) : (
    <PawIcon />
)}
                        </div>
                        <div className="leading-tight overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate w-40" title={user?.ong?.name}>
                                {user?.ong?.name || 'Logo'}
                            </p>
                            <p className="text-[10px] text-gray-400">Administrativo</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
                    {renderNavItems()}
                </nav>

            <div className="px-3 pb-4 pt-2">
                <div className="border-t border-gray-100 pt-4">

                    {renderAssinaturaSistema()}

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="mt-3 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150"
                    >
                        <span className="text-gray-400">
                            <IconSair />
                        </span>
                        Sair
                    </Link>

                </div>
            </div>
            </aside>

            {/* Conteúdo Principal */}
            <div className="flex-1 flex flex-col overflow-hidden relative z-0">
                {header && (
                    <header className="bg-white border-b border-gray-100 px-8 py-4 hidden md:block">
                        {header}
                    </header>
                )}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}