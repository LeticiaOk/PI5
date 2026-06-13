import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InventoryManager from '@/Components/InventoryManager';

export default function Cleaning({ auth, inventory }) {
    const customFields = [
        { name: 'area_indicada', label: 'Área Indicada', type: 'select', options: ['Canis/Gatis (Seguro para Pets)', 'Área Externa', 'Administrativo', 'Uso Geral'] },
        { name: 'toxicidade', label: 'Grau de Risco (Toxicidade)', type: 'select', options: ['Neutro/Seguro', 'Atenção (Enxaguar bem)', 'Tóxico (Manter longe dos pets)'] }
    ];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Insumos <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Limpeza</span>
                </h2>
            }
        >
            <Head title="Limpeza - Estoque" />
            
            <InventoryManager 
                title="Limpeza" 
                subtitle="Controle de produtos para higienização e desinfecção dos ambientes."
                category="cleaning" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}