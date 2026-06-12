import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Home({ slug, ong, settings, availableCount }) {
    
    
    // ✅ REGRA 1: Título automático trazendo o nome da ONG
    const heroTitle = `Bem-vindo à ${ong.name}`;
    
    // Subtítulo editável
    const heroSubtitle = settings?.hero_subtitle || 'Transformando vidas de quatro patas todos os dias.';
    const primaryColor = settings?.primary_color || '#4f46e5';
    const heroBgColor = settings?.hero_background_color || '#0f172a'; // Cor de fundo
    const heroImage = settings?.hero_image_url; // Pode ser nulo
    // ✅ REGRA 2: Fotos do Sobre (Se ela não enviar, usamos as de teste que são bonitas)
    const photo1 = settings?.about_photo_1 || "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop";
    const photo2 = settings?.about_photo_2 || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop";

    return (
        <div className="min-h-screen bg-white font-sans">
            <Head title={ong.name} />

            {/* HERO SECTION */}
            {/* HERO SECTION (Com ou sem imagem) */}
            <section 
                className="relative w-full py-32 md:py-48 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: heroBgColor }}
            >
                {/* 💡 Inteligência: Se a ONG colocou uma foto, renderiza a imagem e joga uma máscara escura por cima para dar leitura ao texto */}
                {heroImage && (
                    <>
                        <div 
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${heroImage})` }}
                        />
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]" />
                    </>
                )}

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20 text-white shadow-xl">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-lg">
                        Bem-vindo à <span style={{ color: primaryColor }}>{ong.name}</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow">
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            href={route('vitrine.adote', slug)}
                            className="px-8 py-4 rounded-full font-bold text-white transition-transform hover:scale-105 shadow-xl"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Ver Animais para Adoção 🐾
                        </Link>
                        <a 
                            href="#sobre"
                            className="px-8 py-4 rounded-full font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 transition-colors hover:bg-white/20 shadow-lg"
                        >
                            Conhecer nossa história
                        </a>
                    </div>
                </div>
            </section>

            {/* CONTADORES (Mix de automático e manual) */}
            <section className="py-16 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">
                            {/* Número manual que a ONG coloca (ex: 150) */}
                            {settings?.manual_saved_count || 0}+
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Animais Salvos</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black" style={{ color: primaryColor }}>
                            {/* ✅ TOTAL AUTOMÁTICO DO BANCO DE DADOS */}
                            {availableCount}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aguardando Lar</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">
                            {settings?.manual_volunteers_count || 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Voluntários</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-rose-500">100%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dedicação</p>
                    </div>
                </div>
            </section>

            {/* SOBRE NÓS COM AS 2 FOTOS */}
            <section id="sobre" className="py-24 max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 flex gap-4">
                        <img src={photo1} className="w-1/2 h-80 object-cover rounded-3xl shadow-lg" alt="ONG Photo 1" />
                        <img src={photo2} className="w-1/2 h-80 object-cover rounded-3xl shadow-lg mt-12" alt="ONG Photo 2" />
                    </div>
                    
                    <div className="flex-1">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>Sobre Nós</h2>
                        <h3 className="text-4xl font-black text-slate-900 mb-6">Uma missão movida por empatia e dedicação.</h3>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            {settings?.about_text || 'Descreva aqui a história e os objetivos da sua instituição.'}
                        </p>
                        <Link href={route('vitrine.quem-somos', slug)} className="font-bold border-b-2" style={{ borderColor: primaryColor }}>
                            Ler a história completa →
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA DOAÇÃO */}
            <section className="py-24 px-4">
                <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                        Não pode adotar agora? <br/> 
                        <span style={{ color: primaryColor }}>Você ainda pode salvar vidas.</span>
                    </h2>
                    <button className="px-10 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform">
                        Ver formas de ajudar ❤️
                    </button>
                </div>
            </section>

                   {/* SEÇÃO DE CONTATO E REDES SOCIAIS */}
<section className="py-12 bg-gray-50 text-center border-t border-gray-200">
    <div className="flex justify-center gap-6 mb-6">
        {settings?.facebook_url && (
            <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 font-bold">Facebook</a>
        )}
        {settings?.instagram_url && (
            <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-600 font-bold">Instagram</a>
        )}
    </div>

    {/* A lógica do WhatsApp com a trava de privacidade */}
    {settings?.public_whatsapp && settings?.display_whatsapp && (
        <a 
            href={`https://wa.me/55${settings.public_whatsapp.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
        >
            Falar pelo WhatsApp
        </a>
    )}
</section> 
        </div>
    );
}