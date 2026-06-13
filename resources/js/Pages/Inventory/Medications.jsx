import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InventoryManager from '@/Components/InventoryManager';

export default function Medications({ auth, inventory }) {
    // Campos específicos para o Petshop / Clínica
    const customFields = [
        { name: 'dosagem', label: 'Dosagem/Concentração (ex: 50mg)', type: 'text' },
        { name: 'validade', label: 'Data de Validade (Lote atual)', type: 'date' },
        { name: 'via_administracao', label: 'Via de Administração', type: 'select', options: ['Oral', 'Tópico', 'Injetável', 'Oftálmico', 'Otológico'] }
    ];

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <h2 className="text-sm font-medium text-gray-500 flex items-center">
                    Insumos <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Medicamentos</span>
                </h2>
            }
        >
            <Head title="Medicamentos - Estoque" />
            
            <InventoryManager 
                title="Medicamentos" 
                subtitle="Controle de farmácia, validade e dosagens de tratamentos."
                category="medications" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}