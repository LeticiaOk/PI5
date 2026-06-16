import React from 'react';
import { Head, Link } from '@inertiajs/react';
import VitrineLayout from '@/Layouts/VitrineLayout';

export default function Home({ slug, ong, settings, availableCount }) {
    
    const heroSubtitle = settings?.hero_subtitle || 'Transformando vidas de quatro patas todos os dias.';
    const primaryColor = settings?.primary_color || '#4f46e5';
    const heroBgColor = settings?.hero_background_color || '#0f172a';
    const heroImage = settings?.hero_image_url; 
    
    const photo1 = settings?.about_photo_1 || "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop";
    const photo2 = settings?.about_photo_2 || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop";

    const fullAboutText = settings?.about_text || 'Uma missão movida por empatia e dedicação para conectar animais resgatados com famílias amorosas.';
    const shortAboutText = fullAboutText.length > 150 ? fullAboutText.substring(0, 150) + '...' : fullAboutText;

    return (
        <VitrineLayout>
        <div className="min-h-screen bg-white font-sans">
            <Head title={ong.name} />

            {/* HERO SECTION DE ALTA PERFORMANCE */}
            <section 
                className="relative w-full py-32 md:py-48 flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: heroBgColor }}
            >
                {heroImage && (
                    <>
                        <img 
                            src={heroImage} 
                            alt="Fundo do Banner" 
                            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
                            decoding="async"
                            loading="eager"
                            style={{ transform: 'translate3d(0, 0, 0)' }}
                        />
                        <div className="absolute inset-0 bg-slate-900/70 z-0" />
                    </>
                )}

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-lg">
                        Bem-vindo à <span style={{ color: primaryColor }}>{ong.name}</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-medium drop-shadow break-words">
                        {heroSubtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link 
                            href={route('vitrine.adote', slug)}
                            className="px-8 py-4 rounded-full font-bold text-white transition-transform hover:scale-105 shadow-xl"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Ver Animais para Adoção
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

            {/* CONTADORES */}
            <section className="py-16 border-y border-slate-100 bg-slate-50/50">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">
                            {settings?.manual_saved_count || 0}+
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Vidas Salvas</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black" style={{ color: primaryColor }}>
                            {availableCount}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Aguardando Lar</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-slate-900">
                            {settings?.manual_volunteers_count || 0}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Voluntários</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-black text-rose-500">100%</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Amor pelos Animais</p>
                    </div>
                </div>
            </section>

            {/* SOBRE NÓS COM AS 2 FOTOS FIXAS E TEXTO FLEXÍVEL */}
            <section id="sobre" className="py-24 max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
                    <div className="w-full lg:w-5/12 flex gap-4 shrink-0">
                        <img src={photo1} className="w-1/2 h-64 sm:h-80 object-cover rounded-3xl shadow-lg" alt="Instituição Foto 1" />
                        <img src={photo2} className="w-1/2 h-64 sm:h-80 object-cover rounded-3xl shadow-lg mt-12" alt="Instituição Foto 2" />
                    </div>
                    
                    <div className="w-full lg:w-7/12 pt-0 lg:pt-8 overflow-hidden">
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>
                            Nossa História
                        </h2>
                        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 leading-tight">
                            Uma missão movida por empatia e dedicação.
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-8 break-words text-lg">
                            {shortAboutText}
                        </p>
                        <Link 
                            href={route('vitrine.quem-somos', slug)} 
                            className="inline-flex items-center gap-2 font-bold hover:opacity-80 transition-opacity text-base border-b-2 pb-0.5" 
                            style={{ color: primaryColor, borderColor: primaryColor }}
                        >
                            Ler a história completa
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA DOAÇÃO */}
            <section className="py-24 px-4">
                <div
    className="max-w-4xl mx-auto rounded-[3rem] p-10 sm:p-20 text-center shadow-2xl"
    style={{ backgroundColor: heroBgColor }}
>
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-8 leading-tight">
                        Não pode adotar agora? <br/> 
                        <span style={{ color: primaryColor }}>Você ainda pode salvar vidas.</span>
                    </h2>
                    <Link 
                        href={route('vitrine.doar', slug)} 
                        className="inline-block px-10 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
                    >
                        Ver formas de ajudar
                    </Link>
                </div>
            </section>
                
        </div>
        </VitrineLayout>
    );
}