import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Header({ slug }) {
    const [isOpen, setIsOpen] = useState(false);
    
    const { url, props } = usePage();
    
    // Lê 'ong' conforme enviado pelo Controller
    const ong = props.ong || {}; 
    const settings = props.settings || {};

    const ongName = ong.name || 'Instituição';
    const primaryColor = settings.primary_color || '#ff5733'; 
    
    // 🛡️ Lê o logo_path direto da Model Ong
    const logoUrl = ong.logo_path;

    const navLinks = [
        { name: 'Home', href: route('vitrine.home', { slug }) },
        { name: 'Adote', href: route('vitrine.adote', { slug }) },
        { name: 'Sobre nós', href: route('vitrine.quem-somos', { slug }) },
        { name: 'Seja um voluntário', href: '#' }, 
    ];

    const isActive = (href) => {
        try {
            return url === new URL(href).pathname;
        } catch (e) {
            return false;
        }
    };

    return (
        <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    
                    {/* LOGO E NOME DINÂMICOS */}
                    <Link 
                        href={route('vitrine.home', { slug })}
                        className="flex items-center gap-3 group focus:outline-none"
                    >
                        {logoUrl ? (
                            <img 
                                // O src precisa do caminho correto. Se o banco salva "/storage/...", está ótimo.
                                src={logoUrl} 
                                alt={`Logo ${ongName}`} 
                                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-300"
                            />
                        ) : (
                            <span className="text-3xl transition-transform group-hover:scale-110 duration-300 select-none">
                                🐾
                            </span>
                        )}
                        <div className="flex flex-col">
                            <span className="text-lg font-black tracking-tight text-gray-900 leading-tight transition-colors">
                                {ongName}
                            </span>
                        </div>
                    </Link>

                    {/* NAVBAR DESKTOP */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold tracking-wide transition-all relative py-2 text-gray-600 hover:opacity-70"
                                style={{ color: isActive(link.href) ? primaryColor : undefined }}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    <span 
                                        className="absolute bottom-0 left-0 w-full h-0.5 rounded-full animate-fade-in" 
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* BOTÃO DE DOAÇÃO */}
                    <div className="hidden md:block">
                        <Link
                            href={route('vitrine.doar', { slug })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-black rounded-xl shadow-md transition-all hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ backgroundColor: primaryColor }}
                        >
                             Faça uma doação
                        </Link>
                    </div>

                    {/* HAMBÚRGUER MOBILE */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            {isOpen ? (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-slide-down">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                                    isActive(link.href) ? 'bg-gray-50' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                                style={{ color: isActive(link.href) ? primaryColor : undefined }}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 px-4">
                            <Link
                                href={route('vitrine.doar', { slug })}
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 text-white text-base font-black rounded-xl shadow-md transition-colors"
                                style={{ backgroundColor: primaryColor }}
                            >
                                Faça uma doação
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}