import VitrineLayout from '@/Layouts/VitrineLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function QuemSomos({ slug }) {
    const { tenant } = usePage().props;
    const settings = tenant?.settings || {};
    const primaryColor = settings.primary_color || '#4f46e5'; 
    const ongName = tenant?.name || 'Instituição';

    const fullAboutText = settings.about_text || 'Esta instituição ainda não cadastrou sua história detalhada.';

    const photo1 = settings.about_photo_1 || "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=1000&auto=format&fit=crop";
    const photo2 = settings.about_photo_2 || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000&auto=format&fit=crop";

    return (
        <VitrineLayout>
        <div className="min-h-screen bg-white">
            <Head title={`A História da ${ongName}`} />
            
            {/* CABEÇALHO ELEGANTE COM FOTOS */}
            <div className="w-full bg-slate-50 pt-20 pb-16">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <h1 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: primaryColor }}>
                        Nossa Essência
                    </h1>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-12">
                        A História da {ongName}
                    </h2>
                    
                    {/* 🛡️ CORREÇÃO MOBILE: Removemos o hidden da Foto 2 */}
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <img 
                            src={photo1} 
                            alt="Equipe / Trabalho Foto 1" 
                            className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-3xl shadow-md border border-gray-100 shrink-0" 
                        />
                        <img 
                            src={photo2} 
                            alt="Equipe / Trabalho Foto 2" 
                            className="w-full md:w-1/2 h-64 md:h-96 object-cover rounded-3xl shadow-md border border-gray-100 shrink-0" 
                        />
                    </div>
                </div>
            </div>

            {/* CORPO DO TEXTO DA HISTÓRIA */}
            <div className="max-w-3xl mx-auto px-4 py-16">
                
                <div className="prose prose-lg prose-slate max-w-none mb-16 break-words">
                    <p className="text-slate-700 leading-loose text-lg whitespace-pre-wrap">
                        {fullAboutText}
                    </p>
                </div>

                <div className="flex flex-col items-center border-t border-gray-100 pt-10">
                    <p className="text-slate-500 mb-6 font-medium">Faça parte desta jornada conosco.</p>
                    <div className="flex gap-4">
                        <Link 
                            href={route('vitrine.doar', slug)} 
                            className="px-8 py-3.5 rounded-2xl font-bold text-white transition-transform hover:scale-105 shadow-md"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Doar agora ❤️
                        </Link>
                        <Link 
                            href={route('vitrine.home', slug)} 
                            className="px-8 py-3.5 rounded-2xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            Voltar ao início
                        </Link>
                    </div>
                </div>

            </div>
        </div>
        </VitrineLayout>
    );
}