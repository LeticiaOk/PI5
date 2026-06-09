import { z } from 'zod';

export const temporaryHomeSchema = z.object({
    name: z.string().min(1, "O nome do responsável é obrigatório"),
    phone: z.string().min(10, "Telefone inválido"),
    max_capacity: z.number().min(1, "A capacidade deve ser de pelo menos 1 animal"),
    notes: z.string().optional().nullable(),
    
    // Endereço
    zip_code: z.string().min(8, "CEP inválido"),
    street: z.string().min(1, "A rua é obrigatória"),
    number: z.string().min(1, "O número é obrigatório"),
    neighborhood: z.string().min(1, "O bairro é obrigatório"),
    city: z.string().min(1, "A cidade é obrigatória"),
    state: z.string().length(2, "Use a sigla do estado (Ex: SP)"),
});

export type TemporaryHomeFormData = z.infer<typeof temporaryHomeSchema>;