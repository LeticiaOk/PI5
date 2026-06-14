import VitrineLayout from '@/Layouts/VitrineLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ComoAdotar({ slug }) {
    const { tenant } = usePage().props;
    const primaryColor = tenant?.settings?.primary_color || '#4f46e5'; 

    return (
        <VitrineLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <Head title={`Como Adotar - ${tenant?.name}`} />
            <h1 className="text-3xl font-bold mb-4">Como Adotar</h1>
            <p className="text-gray-600 mb-6 text-center max-w-lg">O processo de adoção é simples, mas rigoroso para garantir a segurança dos nossos animais. (Página em construção)</p>
            <Link href={`/${slug}/adote`} style={{ backgroundColor: primaryColor }} className="text-white px-6 py-3 rounded-lg font-bold">Voltar para a Vitrine</Link>
        </div>
        </VitrineLayout>
    );
}