import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Header({ slug }) {
    const [isOpen, setIsOpen] = useState(false);

    const { url, props } = usePage();

    const ong = props.ong || {};
    const settings = props.settings || {};

    const ongName = ong.name || 'Instituição';
    const primaryColor = settings.primary_color || '#ff5733';
    const logoUrl = ong.logo_path;

    // 🔥 WhatsApp formatado (mesma lógica do footer)
    const whatsappNumber = settings.public_whatsapp
        ? `55${settings.public_whatsapp.replace(/\D/g, '')}`
        : null;

    const whatsappLink = whatsappNumber
        ? `https://wa.me/${whatsappNumber}`
        : '#';

    const navLinks = [
        { name: 'Home', href: route('vitrine.home', { slug }), type: 'internal' },
        { name: 'Adote', href: route('vitrine.adote', { slug }), type: 'internal' },
        { name: 'Sobre nós', href: route('vitrine.quem-somos', { slug }), type: 'internal' },
        { name: 'Seja um voluntário', href: whatsappLink, type: 'external' },
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

                    {/* NAV DESKTOP */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            // 🔥 se for externo (WhatsApp), usa <a>
                            if (link.type === 'external') {
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-bold tracking-wide text-gray-600 hover:opacity-70 transition-all relative py-2"
                                    >
                                        {link.name}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-bold tracking-wide transition-all relative py-2 text-gray-600 hover:opacity-70"
                                    style={{ color: isActive(link.href) ? primaryColor : undefined }}
                                >
                                    {link.name}

                                    {isActive(link.href) && (
                                        <span
                                            className="absolute bottom-0 left-0 w-full h-0.5 rounded-full"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* BOTÃO DOAÇÃO */}
                    <div className="hidden md:block">
                        <Link
                            href={route('vitrine.doar', { slug })}
                            className="px-5 py-2.5 text-white text-sm font-black rounded-xl shadow-md"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Faça uma doação
                        </Link>
                    </div>

                    {/* MOBILE */}
                    <div className="flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)}>
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100">
                    <div className="px-4 py-4 space-y-2">

                        {navLinks.map((link) => {
                            if (link.type === 'external') {
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                );
                            }

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-base font-bold text-gray-600 hover:bg-gray-50"
                                    style={{ color: isActive(link.href) ? primaryColor : undefined }}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                    </div>
                </div>
            )}
        </header>
    );
}