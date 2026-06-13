import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InventoryManager from '@/Components/InventoryManager';

export default function Food({ auth, inventory }) {
    const customFields = [
        { name: 'especie', label: 'Para qual espécie?', type: 'select', options: ['Cachorros', 'Gatos', 'Ambos'] },
        { name: 'fase', label: 'Fase da Vida', type: 'select', options: ['Filhote', 'Adulto', 'Sênior', 'Todas as Fases'] }
    ];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Insumos <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Ração</span>
                </h2>
            }
        >
            <Head title="Ração - Estoque" />
            
            <InventoryManager 
                title="Ração" 
                subtitle="Controle a entrada e saída do estoque de alimentos da ONG."
                category="food" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}