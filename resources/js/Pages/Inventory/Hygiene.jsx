import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InventoryManager from '@/Components/InventoryManager';

export default function Hygiene({ auth, inventory }) {
    const customFields = [
        { name: 'tipo_uso', label: 'Categoria de Uso', type: 'select', options: ['Banho/Tosa', 'Antiparasitário (Coleiras/Pipetas)', 'Higiene Bucal', 'Tapetes/Fraldas', 'Acessórios'] }
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Estoque: Higiene Pet</h2>}>
            <Head title="Higiene - Estoque" />
            
            <InventoryManager 
                title="Higiene Pet" 
                category="hygiene" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}