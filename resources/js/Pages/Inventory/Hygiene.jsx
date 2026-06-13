import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InventoryManager from '@/Components/InventoryManager';

export default function Hygiene({ auth, inventory }) {
    const customFields = [
        { name: 'tipo_uso', label: 'Categoria de Uso', type: 'select', options: ['Banho/Tosa', 'Antiparasitário (Coleiras/Pipetas)', 'Higiene Bucal', 'Tapetes/Fraldas', 'Acessórios'] }
    ];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Insumos <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Higiene Pet</span>
                </h2>
            }
        >
            <Head title="Higiene - Estoque" />
            
            <InventoryManager 
                title="Higiene Pet" 
                subtitle="Gestão de produtos para banho, tosa e cuidados antiparasitários."
                category="hygiene" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}