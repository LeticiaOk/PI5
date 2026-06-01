import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Animal, Breed, Adopter, TemporaryHome } from '@/types/animal';

interface AnimalContextType {
    animals: Animal[];
    adopters: Adopter[];
    temporaryHomes: TemporaryHome[];
    breeds: Breed[];
    search: string;
    setSearch: (s: string) => void;
    sort: 'newest' | 'oldest';
    toggleSort: () => void;
    filteredAnimals: Animal[];
    isCreateOpen: boolean;
    setIsCreateOpen: (b: boolean) => void;
    editingAnimal: Animal | null;
    setEditingAnimal: (a: Animal | null) => void;
    adoptionModal: { isOpen: boolean; animal: Animal | null };
    setAdoptionModal: (state: { isOpen: boolean; animal: Animal | null }) => void;
    locationModal: { isOpen: boolean; home: TemporaryHome | null };
    setLocationModal: (state: { isOpen: boolean; home: TemporaryHome | null }) => void;
}

const AnimalContext = createContext<AnimalContextType | undefined>(undefined);

export function AnimalProvider({ children, initialAnimals, adopters, temporaryHomes, breeds }: { 
    children: ReactNode; initialAnimals: Animal[] | { data: Animal[] }; adopters: Adopter[]; temporaryHomes: TemporaryHome[]; breeds: Breed[];
}) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
    const [adoptionModal, setAdoptionModal] = useState<{ isOpen: boolean; animal: Animal | null }>({ isOpen: false, animal: null });
    const [locationModal, setLocationModal] = useState<{ isOpen: boolean; home: TemporaryHome | null }>({ isOpen: false, home: null });

    const animalsList = useMemo(() => Array.isArray(initialAnimals) ? initialAnimals : (initialAnimals.data || []), [initialAnimals]);

    const filteredAnimals = useMemo(() => {
        let list = [...animalsList];
        if (search.trim()) {
            const query = search.toLowerCase();
            list = list.filter((a) => (a.name ?? '').toLowerCase().includes(query) || (a.breed?.name ?? 'srd').toLowerCase().includes(query));
        }
        list.sort((a, b) => new Date(a.arrival_date).getTime() - new Date(b.arrival_date).getTime() * (sort === 'newest' ? -1 : 1));
        return list;
    }, [animalsList, search, sort]);

    const toggleSort = () => setSort((s) => (s === 'newest' ? 'oldest' : 'newest'));

    return (
        <AnimalContext.Provider value={{
            animals: animalsList, adopters, temporaryHomes, breeds,
            search, setSearch, sort, toggleSort, filteredAnimals,
            isCreateOpen, setIsCreateOpen, editingAnimal, setEditingAnimal,
            adoptionModal, setAdoptionModal, locationModal, setLocationModal
        }}>
            {children}
        </AnimalContext.Provider>
    );
}

export function useAnimal() {
    const context = useContext(AnimalContext);
    if (!context) throw new Error('useAnimal deve ser usado dentro de um AnimalProvider');
    return context;
}