import { z } from 'zod';
import { animalFormSchema } from '@/lib/schemas/animalSchema';

// 💡 Tipagem do formulário inferida diretamente do Zod (Garante sincronia total)
export type AnimalFormData = z.infer<typeof animalFormSchema>;

// Interfaces das entidades do banco de dados (Relações trazidas via Eager Loading)

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Breed {
    id: string;
    name: string;
    species: 'dog' | 'cat' | 'other';
}

export interface Adopter {
    id: string;
    name: string;
    cpf: string;
}

export interface Address {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code?: string;
}

export interface TemporaryHome {
    id: string;
    name: string;
    max_capacity: number;
    phone?: string;
    address?: Address;
}

// 💡 Entidade de Negócio do Animal completa
export interface Animal {
    id: string;
    name: string;
    species: 'dog' | 'cat' | 'other';
    gender: 'male' | 'female';
    size: 'small' | 'medium' | 'large';
    weight?: string | number;
    arrival_date: string;
    estimated_birth_date?: string;
    is_neutered: boolean;
    is_vaccinated: boolean;
    is_dewormed: boolean;
    status: 'available' | 'adopted' | 'deceased' | 'foster_care' | 'under_treatment' | 'returned';
    photo_url?: string;
    description?: string | null;
    breed?: Breed;
    temporary_home?: TemporaryHome;
}