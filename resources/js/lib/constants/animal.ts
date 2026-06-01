export const animalTranslate = {
  species: {
    dog: 'Cachorro',
    cat: 'Gato',
    other: 'Outro',
  },

  gender: {
    male: 'Macho',
    female: 'Fêmea',
  },

  size: {
    small: 'P',
    medium: 'M',
    large: 'G',
  },

  status: {
    available: 'Disponível',
    foster_care: 'Lar temporário',
    adopted: 'Adotado',
    under_treatment: 'Em tratamento',
    returned: 'Retornado (Avaliação)',
  },
} as const;

export const animalStatusStyle = {
  available:
    'bg-green-100 text-green-700',

  foster_care:
    'bg-purple-100 text-purple-700',

  adopted:
    'bg-blue-100 text-blue-700',

  under_treatment:
    'bg-yellow-100 text-yellow-700',

  returned:
    'bg-orange-100 text-orange-700',
} as const;