import { Head, Link, usePage } from '@inertiajs/react';

export default function QuemSomos({ slug }) {
    const { tenant } = usePage().props;
    const primaryColor = tenant?.settings?.primary_color || '#4f46e5'; 

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Head title={`Quem Somos - ${tenant?.name}`} />
            <h1 className="text-3xl font-bold mb-4">Nossa História</h1>
            <p className="text-gray-600 mb-6 text-center max-w-lg whitespace-pre-line">
                {tenant?.settings?.about_text || 'Página em construção.'}
            </p>
            <Link href={`/${slug}`} style={{ color: primaryColor }} className="font-bold underline">Voltar ao início</Link>
        </div>
    );
}