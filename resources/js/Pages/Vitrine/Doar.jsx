import { Head, Link, usePage } from '@inertiajs/react';

export default function Doar({ slug }) {
    const { tenant } = usePage().props;
    const primaryColor = tenant?.settings?.primary_color || '#4f46e5'; 

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Head title={`Apoie a Causa - ${tenant?.name}`} />
            <span className="text-5xl mb-4">❤️</span>
            <h1 className="text-3xl font-bold mb-2">Faça uma doação</h1>
            <p className="text-gray-600 mb-6 text-center max-w-lg">Sua ajuda mantém nosso abrigo funcionando e salva vidas. Em breve informaremos nossos dados bancários e PIX.</p>
            <Link href={`/${slug}/adote`} className="text-gray-500 hover:text-gray-800 underline">Voltar</Link>
        </div>
    );
}