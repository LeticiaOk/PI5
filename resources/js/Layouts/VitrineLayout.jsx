// resources/js/Layouts/VitrineLayout.jsx

import Header from '@/Components/Vitrine/Header';
import Footer from '@/Components/Vitrine/Footer';
import { usePage } from '@inertiajs/react';

export default function VitrineLayout({ children }) {
    // Captura os dados globais compartilhados pelo Inertia
    const { props } = usePage();
    
    const slug = props.slug; 
    const settings = props.settings || {}; 
    const tenantName = props.tenant?.name || 'Instituição'; 

    return (
        <div className="min-h-screen bg-[#F4F2ED] text-gray-900 flex flex-col">
            {/* Header Global */}
            <Header slug={slug} />

            {/* Conteúdo Principal expandindo para empurrar o footer para baixo */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer Global da Instituição Modularizado */}
            <Footer settings={settings} tenantName={tenantName} />
        </div>
    );
}