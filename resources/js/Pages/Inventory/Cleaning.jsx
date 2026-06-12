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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Estoque: Limpeza</h2>}>
            <Head title="Limpeza - Estoque" />
            
            <InventoryManager 
                title="Material de Limpeza" 
                category="cleaning" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}