import { Head, Link, usePage } from '@inertiajs/react';

export default function Home({ slug }) {
    const { tenant } = usePage().props;
    const settings = tenant?.settings || {};
    const primaryColor = settings.primary_color || '#4f46e5'; 
    const ongName = tenant?.name || 'ONG Parceira';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 antialiased font-sans">
            <Head title={`Início - ${ongName}`} />
            
            <div className="text-center space-y-6">
                <span className="p-4 rounded-3xl inline-block" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
                    🐾
                </span>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                    Bem-vindo à <br/><span style={{ color: primaryColor }}>{ongName}</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-md mx-auto">
                    {settings.hero_subtitle || 'Ajudando animais a encontrarem lares amorosos.'}
                </p>
                
                <div className="pt-4 flex gap-4 justify-center">
                    <Link 
                        href={`/${slug}/adote`} 
                        className="px-8 py-3 rounded-xl text-white font-bold shadow-lg transition-transform hover:scale-105"
                        style={{ backgroundColor: primaryColor }}
                    >
                        Ver Animais para Adoção
                    </Link>
                    <Link 
                        href={`/${slug}/quem-somos`} 
                        className="px-8 py-3 rounded-xl text-gray-700 bg-white border border-gray-200 font-bold hover:bg-gray-50 transition-colors"
                    >
                        Conheça nossa história
                    </Link>
                </div>
            </div>
        </div>
    );
}