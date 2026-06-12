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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800">Estoque: Medicamentos</h2>}>
            <Head title="Medicamentos - Estoque" />
            
            <InventoryManager 
                title="Medicamentos" 
                category="medications" 
                data={inventory} 
                customFields={customFields} 
            />
        </AuthenticatedLayout>
    );
}