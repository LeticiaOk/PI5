import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import VolunteerModal from '@/Components/Vitrine/VolunteerModal';

export default function Header({ slug }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false); 

    const { url, props } = usePage();
    const ong = props.ong || {};
    const settings = props.settings || {};

    const ongName = ong.name || 'Instituição';
    const primaryColor = settings.primary_color || '#ff5733';
    const logoUrl = ong.logo_path;

    const navLinks = [
        { name: 'Home', href: route('vitrine.home', { slug }), type: 'internal' },
        { name: 'Adote', href: route('vitrine.adote', { slug }), type: 'internal' },
        { name: 'Sobre nós', href: route('vitrine.quem-somos', { slug }), type: 'internal' },
        { name: 'Seja um voluntário', type: 'modal' }, 
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

                    {/* LOGO */}
                    <Link
                        href={route('vitrine.home', { slug })}
                        className="flex items-center gap-3 group"
                    >
                        {logoUrl ? (
                            <img src={logoUrl} alt={ongName} className="h-10 w-auto object-contain" />
                        ) : (
                            <span className="text-3xl">🐾</span>
                        )}
                        <span className="text-lg font-black text-gray-900">
                            {ongName}
                        </span>
                    </Link>

                    {/* MENU DESKTOP COM O EFEITO VISUAL DE VOLTA */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            if (link.type === 'modal') {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => setIsVolunteerModalOpen(true)}
                                        className="relative py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors group"
                                    >
                                        {link.name}
                                        {/* Efeito de hover no modal */}
                                        <span 
                                            className="absolute bottom-0 left-0 h-[2px] w-0 bg-gray-900 transition-all duration-300 rounded-full group-hover:w-full"
                                        />
                                    </button>
                                );
                            }
                            
                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="relative py-2 text-sm font-bold transition-colors group"
                                    style={{ color: active ? primaryColor : '#4B5563' }}
                                >
                                    {link.name}
                                    {/* 🔴 A BARRINHA ATIVA QUE VOCÊ GOSTAVA (Agora com animação!) */}
                                    <span 
                                        className={`absolute bottom-0 left-0 h-[2.5px] transition-all duration-300 rounded-full ${
                                            active ? 'w-full' : 'w-0 group-hover:w-full'
                                        }`}
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* BOTÃO DOAÇÃO */}
                    <div className="hidden md:block">
                        <Link
                            href={route('vitrine.doar', { slug })}
                            className="px-5 py-2.5 text-white text-sm font-black rounded-xl shadow-md hover:scale-105 transition-transform"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Faça uma doação
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE */}
                    <div className="flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl focus:outline-none text-gray-600">
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-fade-in">
                    <div className="px-4 py-4 space-y-2">

                        {navLinks.map((link) => {
                            if (link.type === 'modal') {
                                return (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsVolunteerModalOpen(true);
                                        }}
                                        className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50"
                                    >
                                        {link.name}
                                    </button>
                                );
                            }

                            const active = isActive(link.href);

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-bold hover:bg-gray-50 border-l-4 transition-all"
                                    style={{ 
                                        color: active ? primaryColor : '#4B5563',
                                        borderColor: active ? primaryColor : 'transparent',
                                        backgroundColor: active ? `${primaryColor}10` : 'transparent' // Fundo levemente colorido no mobile
                                    }}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                        
                        <Link
                            href={route('vitrine.doar', { slug })}
                            onClick={() => setIsOpen(false)}
                            className="block text-center mt-4 px-4 py-3 rounded-xl text-base font-bold text-white shadow-md active:scale-95 transition-transform"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Faça uma doação
                        </Link>

                    </div>
                </div>
            )}

            {isVolunteerModalOpen && (
                <VolunteerModal 
                    slug={slug} 
                    ongName={ongName} 
                    onClose={() => setIsVolunteerModalOpen(false)} 
                />
            )}

        </header>
    );
}