// resources/js/Components/Vitrine/Header.jsx

import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

// 1. Recebemos o 'slug' como propriedade do componente
export default function Header({ slug }) {
    const [isOpen, setIsOpen] = useState(false);
    const { url } = usePage();

    // 2. Injetamos o objeto contendo o { slug } em cada rota pública
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
                    
                    {/* LOGO E NOME (Adicionado o parâmetro slug) */}
                    <Link 
                        href={route('vitrine.home', { slug })}
                        className="flex items-center gap-2.5 group focus:outline-none"
                    >
                        <span className="text-3xl transition-transform group-hover:scale-110 duration-300 select-none">
                            🐶
                        </span>
                        <div className="flex flex-col">
                            {/* Alterado o hover da logo para refletir a nova cor identidade */}
                            <span className="text-lg font-black tracking-tight text-gray-900 leading-tight group-hover:text-[#ff5733] transition-colors">
                                Cão Feliz
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 leading-none">
                                Proteção Animal
                            </span>
                        </div>
                    </Link>

                    {/* NAVBAR PARA DESKTOP */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-bold tracking-wide transition-all relative py-2 ${
                                    isActive(link.href)
                                        ? 'text-[#ff5733]' // Cor quando selecionado
                                        : 'text-gray-600 hover:text-[#ff5733]' // Cor original e hover
                                }`}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    // Linha inferior indicadora com a cor customizada
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ff5733] rounded-full animate-fade-in" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* BOTÃO DE DOAÇÃO EM DESTAQUE (Adicionado o parâmetro slug) */}
                    <div className="hidden md:block">
                        <Link
                            href={route('vitrine.doar', { slug })}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff5733] hover:bg-orange-600 text-white text-sm font-black rounded-xl shadow-md shadow-orange-100 transition-all hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                             Faça uma doação
                        </Link>
                    </div>

                    {/* BOTÃO HAMBÚRGUER (MOBILE) */}
                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none transition-colors"
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

            {/* NAVBAR EXPANSÍVEL (MOBILE) */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-100 animate-slide-down">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                                    isActive(link.href)
                                        ? 'bg-orange-50 text-[#ff5733]' // Fundo leve e texto quando selecionado no mobile
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#ff5733]' // Hover no mobile
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        
                        <div className="pt-4 px-4">
                            <Link
                                href={route('vitrine.doar', { slug })}
                                onClick={() => setIsOpen(false)}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-orange-500 hover:bg-orange-600 text-white text-base font-black rounded-xl shadow-md shadow-orange-100 transition-colors"
                            >
                                ❤️ Faça uma doação
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}