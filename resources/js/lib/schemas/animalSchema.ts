import { z } from 'zod';

// Define esquema de validacao rigorosa para o formulario de animais
export const animalFormSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    species: z.enum(["dog", "cat", "other"]),
    
    // Aceita UUID, nulo ou string vazia do select
    breed_id: z.string().uuid("Raça inválida").optional().nullable().or(z.literal('')),
    
    gender: z.enum(["male", "female"]),
    size: z.enum(["small", "medium", "large"]),
    
    weight: z.string().optional().nullable().or(z.literal('')),
    
    arrival_date: z.string().min(1, "Data de chegada obrigatória"),
    estimated_birth_date: z.string().optional().nullable().or(z.literal('')),
    
    // Booleanos obrigatórios para os checkboxes
is_neutered: z.boolean(),
    is_vaccinated: z.boolean(),
    is_dewormed: z.boolean(),
    
    status: z.enum(["available", "adopted", "deceased", "foster_care", "under_treatment", "returned"]),
    description: z.string().optional().nullable().or(z.literal('')),
    
    temporary_home_id: z.string().uuid("Lar temporário inválido").optional().nullable().or(z.literal('')),
    
    // Valida estritamente se o objeto inserido e um arquivo nativo do navegador
    photo: z.instanceof(File, { message: "A foto deve ser um arquivo de imagem válido" }).optional().nullable(),
});

// Extrai o tipo baseado no esquema para usar no formulario
export type AnimalInput = z.infer<typeof animalFormSchema>;