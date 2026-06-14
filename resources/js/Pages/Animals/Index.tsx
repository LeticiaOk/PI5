import React, { useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';

// Layout autenticado e contexto global dos animais
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { AnimalProvider, useAnimal } from '@/contexts/AnimalContext';
import { Animal, Adopter, TemporaryHome, Breed, User } from '@/types/animal';

// Componentes Visuais (Modais e Padronização)
import CreateAnimalModal from '@/Components/CreateAnimalModal';
import EditAnimalModal from '@/Components/EditAnimalModal';
import BaseModal from '@/Components/Modals/BaseModal';
import DynamicForm from '@/Components/Modals/DynamicForm';
import DataBrowser from '@/Components/DataBrowser';

// traduções e constantes
import { animalTranslate, animalStatusStyle } from '@/lib/constants/animal';

interface PageProps {
    auth: {
        user: User;
    };
    animals: Animal[] | { data: Animal[] };
    adopters: Adopter[];
    temporaryHomes: TemporaryHome[];
    breeds: Breed[];
}

const formatDate = (date?: string): string => date ? new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '—';

const calculateAge = (birthDate?: string): string => {
    if (!birthDate) return '—';
    const diff = new Date().getTime() - new Date(birthDate).getTime();
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();
    if (years === 0 && months === 0) return '< 1 mês';
    if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
};

// ── Micro componentes de badges e ícones ────────────────────────────────────
const BoolBadge = ({ value, yes = 'Sim', no = 'Não' }: { value: boolean; yes?: string; no?: string; }) => (
    <span className={`inline-flex items-center justify-center min-w-[52px] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm ${value ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
        {value ? yes : no}
    </span>
);

const StatusBadge = ({ status }: { status: Animal['status']; }) => (
   <span className={`inline-flex items-center justify-center min-w-[100px] px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm ${animalStatusStyle[status]}`}>
        {animalTranslate.status[status] ?? status}
    </span>
);

const AdoptIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>; 
const EditIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const PawIcon = () => <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C10.5 2 9.2 3.2 9.2 4.7C9.2 6.2 10.5 7.5 12 7.5C13.5 7.5 14.8 6.2 14.8 4.7C14.8 3.2 13.5 2 12 2ZM6.5 6C5.1 6 4 7.1 4 8.5C4 9.9 5.1 11 6.5 11C7.9 11 9 9.9 9 8.5C9 7.1 7.9 6 6.5 6ZM17.5 6C16.1 6 15 7.1 15 8.5C15 9.9 16.1 11 17.5 11C18.9 11 20 9.9 20 8.5C20 7.1 18.9 6 17.5 6ZM12 10C9.2 10 7 12.2 7 15C7 18 9 22 12 22C15 22 17 18 17 15C17 12.2 14.8 10 12 10Z"/></svg>;
const ViewIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const GenderIcon = ({ gender }: { gender: Animal['gender'] }) => gender === 'female' ? (
    <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="9" r="5" /><path strokeLinecap="round" d="M12 14v6M9 17h6" /></svg>
) : (
    <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="10" cy="14" r="5" /><path strokeLinecap="round" d="M19 5l-5 5M19 5h-5M19 5v5" /></svg>
);

// ── DataBrowser Conectado ao Contexto ─────────────────────────────────────────
function AnimalsTableContent({ animalsArray }: { animalsArray: Animal[] }) {
    const { setIsCreateOpen, setEditingAnimal, setAdoptionModal, setLocationModal } = useAnimal();

    return (
        <DataBrowser
            title="Animais Cadastrados"
            subtitle="Banco de dados e gestão de todos os animais resgatados."
            data={animalsArray}
            onAddClick={() => setIsCreateOpen(true)}
            addLabel="Adicionar Animal"
            searchPlaceholder="Buscar por nome, espécie ou raça..."
            searchFn={(a, q) => (a.name||'').toLowerCase().includes(q) || (a.species||'').toLowerCase().includes(q) || (a.breed?.name||'').toLowerCase().includes(q)}
            sortFn={(a, b) => a.name.localeCompare(b.name)}
            columns={[
                { label: 'FOTO', key: 'photo_url', render: (_, a) => (
                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {a.photo_url ? <img src={a.photo_url} className="w-full h-full object-cover" /> : <PawIcon />}
                    </div>
                )},
                { label: 'SEXO', key: 'gender', render: (_, a) => <GenderIcon gender={a.gender} /> },
                { label: 'NOME', key: 'name', render: (val) => <span className="font-bold text-gray-900 whitespace-nowrap">{val}</span> },
                { label: 'ESPÉCIE', key: 'species', render: (val) => <span className="text-gray-700 whitespace-nowrap">{animalTranslate.species[val as string] ?? val}</span> },
                { label: 'RAÇA', key: 'breed', render: (_, a) => <span className="font-semibold text-indigo-600 whitespace-nowrap">{a.breed?.name ?? 'SRD'}</span> },
                { label: 'CHEGADA', key: 'arrival_date', render: (val) => <span className="text-gray-500 whitespace-nowrap">{formatDate(val as string)}</span> },
                { label: 'PORTE', key: 'size', render: (val) => <span className="text-gray-700 whitespace-nowrap">{animalTranslate.size[val as string] ?? val}</span> },
                { label: 'PESO', key: 'weight', render: (val) => <span className="text-gray-700 whitespace-nowrap">{val ? `${val}kg` : '—'}</span> },
                { label: 'IDADE', key: 'estimated_birth_date', render: (val) => <span className="text-gray-700 whitespace-nowrap">{calculateAge(val as string)}</span> },
                { label: 'VERMIF.', key: 'is_dewormed', render: (val) => <BoolBadge value={val as boolean} /> },
                { label: 'CASTR.', key: 'is_neutered', render: (val) => <BoolBadge value={val as boolean} /> },
                { label: 'VACIN.', key: 'is_vaccinated', render: (val) => <BoolBadge value={val as boolean} /> },
                { label: 'STATUS', key: 'status', render: (_, a) => a.status === 'foster_care' ? (
                    <button onClick={() => setLocationModal({ isOpen: true, home: a.temporary_home })} className="group flex flex-col items-center justify-center transition-all">
                        <StatusBadge status={a.status} />
                        <span className="text-[9px] text-indigo-500 font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Ver Local</span>
                    </button>
                ) : <StatusBadge status={a.status} /> },
                { label: 'AÇÕES', key: 'actions', render: (_, a) => (
                    <div className="flex items-center gap-1.5 justify-center">
                        {a.status === 'available' && (
                            <button onClick={() => setAdoptionModal({ isOpen: true, animal: a })} className="p-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-md transition-colors" title="Registrar Adoção"><AdoptIcon /></button>
                        )}
                        <Link href={`/animals/${a.id}`} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors" title="Ver Dossiê"><ViewIcon /></Link>
                        <button onClick={() => setEditingAnimal(a)} className="p-1.5 bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-md transition-colors" title="Editar"><EditIcon /></button>
                        <Link href={`/animals/${a.id}`} method="delete" as="button" onClick={(e) => !confirm(`Tem certeza que deseja excluir ${a.name}?`) && e.preventDefault()} className="p-1.5 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-md transition-colors" title="Excluir"><TrashIcon /></Link>
                    </div>
                )}
            ]}
            renderMobileCard={(a) => (
                <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                                {a.photo_url ? <img src={a.photo_url} className="w-full h-full object-cover" /> : <PawIcon />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                                    {a.name} <GenderIcon gender={a.gender} />
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {animalTranslate.species[a.species] ?? a.species} • <span className="font-bold text-indigo-500">{a.breed?.name ?? 'SRD'}</span>
                                </p>
                            </div>
                        </div>
                        {/* Ações Top Right - Mesmo Padrão Mobile */}
                        <div className="flex flex-wrap justify-end gap-1.5">
                            {a.status === 'available' && (
                                <button onClick={() => setAdoptionModal({ isOpen: true, animal: a })} className="p-2 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg transition-colors"><AdoptIcon /></button>
                            )}
                            <Link href={`/animals/${a.id}`} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><ViewIcon /></Link>
                            <button onClick={() => setEditingAnimal(a)} className="p-2 bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition-colors"><EditIcon /></button>
                            <Link href={`/animals/${a.id}`} method="delete" as="button" onClick={(e) => !confirm(`Tem certeza que deseja excluir ${a.name}?`) && e.preventDefault()} className="p-2 bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors"><TrashIcon /></Link>
                        </div>
                    </div>
                    
                    {/* Barra de Status e Info Inferior */}
                    <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-lg border border-gray-100 text-sm mt-1">
                        <div>
                            {a.status === 'foster_care' ? (
                                <button onClick={() => setLocationModal({ isOpen: true, home: a.temporary_home })} className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                    <StatusBadge status={a.status} />
                                </button>
                            ) : (
                                <StatusBadge status={a.status} />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <BoolBadge value={a.is_vaccinated} yes="Vacinado" no="S/ Vacina" />
                            <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600 shadow-sm uppercase tracking-wider">{calculateAge(a.estimated_birth_date)}</span>
                        </div>
                    </div>
                </div>
            )}
        />
    );
}

// ── Containers dos modais isolados ─────────────────────────────────────────
function ModalsContainer() {
    const { 
        isCreateOpen, setIsCreateOpen, editingAnimal, setEditingAnimal,
        adoptionModal, setAdoptionModal, locationModal, setLocationModal,
        adopters, temporaryHomes, breeds
    } = useAnimal();

    const adoptionFields = useMemo(() => [
        { name: 'adopter_id', label: 'Selecione o Adotante', type: 'select', options: adopters.map((adopter: Adopter) => ({ value: adopter.id, label: `${adopter.name} (${adopter.cpf})` })), fullWidth: true },
        { name: 'adoption_date', label: 'Data da Adoção', type: 'date', defaultValue: new Date().toISOString().split('T')[0], fullWidth: true },
        { name: 'animal_id', type: 'hidden', defaultValue: adoptionModal.animal?.id }
    ], [adopters, adoptionModal.animal]);

    return (
        <>
            <CreateAnimalModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} breeds={breeds} />
            <EditAnimalModal isOpen={!!editingAnimal} onClose={() => setEditingAnimal(null)} animal={editingAnimal ?? undefined} temporaryHomes={temporaryHomes} breeds={breeds} />
            
            <BaseModal isOpen={adoptionModal.isOpen} onClose={() => setAdoptionModal({ isOpen: false, animal: null })} title={adoptionModal.animal ? `Registrar Adoção: ${adoptionModal.animal.name}` : 'Registrar Adoção'}>
                <DynamicForm fields={adoptionFields} endpoint="/adoptions" routePath="/adoptions" onSuccess={() => setAdoptionModal({ isOpen: false, animal: null })} onCancel={() => setAdoptionModal({ isOpen: false, animal: null })} submitLabel="Confirmar Adoção" />
            </BaseModal>

            <BaseModal isOpen={locationModal.isOpen} onClose={() => setLocationModal({ isOpen: false, home: null })} title="📍 Localização do Animal">
                {locationModal.home ? (
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-2xl">🏠</div>
                            <div>
                                <h3 className="font-bold text-gray-900">{locationModal.home.name}</h3>
                                <p className="text-sm text-gray-500">{locationModal.home.phone}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase">Endereço Completo</h4>
                            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-indigo-900 text-sm">
                                <p><strong>{locationModal.home.address?.street}, {locationModal.home.address?.number}</strong></p>
                                <p>{locationModal.home.address?.neighborhood}</p>
                                <p>{locationModal.home.address?.city} - {locationModal.home.address?.state}</p>
                            </div>
                        </div>
                        <a href={`https://wa.me/55${locationModal.home.phone?.replace(/\D/g, '')}`} target="_blank" className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-colors">
                            💬 Chamar no WhatsApp
                        </a>
                    </div>
                ) : <p className="p-6 text-center text-gray-500">Dados de localização não encontrados.</p>}
            </BaseModal>
        </>
    );
}

// ── Raiz da página principal ──────────────────────────────────────────────
export default function Index(props: PageProps) {
    // Garante que temos a array plana
    const animalsArray = Array.isArray(props.animals) ? props.animals : (props.animals.data || []);

    return (
        <AnimalProvider initialAnimals={props.animals} adopters={props.adopters} temporaryHomes={props.temporaryHomes} breeds={props.breeds}>
            <AuthenticatedLayout 
                user={props.auth.user} 
                header={<h2 className="text-sm font-medium text-gray-500 flex items-center">Gestão de Animais <span className="mx-2 text-gray-300">/</span> <span className="text-gray-900 font-semibold">Animais Cadastrados</span></h2>}
            >
                <Head title="Animais" />
                <AnimalsTableContent animalsArray={animalsArray} />
                <ModalsContainer />
            </AuthenticatedLayout>
        </AnimalProvider>
    );
}