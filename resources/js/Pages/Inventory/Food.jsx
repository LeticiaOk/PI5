import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InventoryManager from '@/Components/InventoryManager';

export default function Food({ auth, inventory }) {
    // A mágica acontece aqui: configuramos os campos específicos para Ração
    const customFields = [
        { name: 'especie', label: 'Para qual espécie?', type: 'select', options: ['Cachorros', 'Gatos', 'Ambos'] },
        { name: 'fase', label: 'Fase da Vida', type: 'select', options: ['Filhote', 'Adulto', 'Sênior', 'Todas as Fases'] }
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Estoque: Ração</h2>}>
            <Head title="Ração - Estoque" />
            
            <InventoryManager 
                title="Ração" 
                category="food" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}