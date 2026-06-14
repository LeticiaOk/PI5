// resources/js/Components/Vitrine/PetCard.jsx

import { Link } from '@inertiajs/react'; // 💡 Importação essencial

// ── Traduções e Mapeamentos Visuais ─────────────────────────────────────────
const translate = {
    species: { dog: 'Cachorro', cat: 'Gato', other: 'Outro' },
    gender:  { male: 'Macho',   female: 'Fêmea' },
    size:    { small: 'Pequeno', medium: 'Médio', large: 'Grande' },
};

// Ícones minimalistas para composição do card
const PawIcon = () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C10.5 2 9.2 3.2 9.2 4.7C9.2 6.2 10.5 7.5 12 7.5C13.5 7.5 14.8 6.2 14.8 4.7C14.8 3.2 13.5 2 12 2ZM6.5 6C5.1 6 4 7.1 4 8.5C4 9.9 5.1 11 6.5 11C7.9 11 9 9.9 9 8.5C9 7.1 7.9 6 6.5 6ZM17.5 6C16.1 6 15 7.1 15 8.5C15 9.9 16.1 11 17.5 11C18.9 11 20 9.9 20 8.5C20 7.1 18.9 6 17.5 6ZM12 10C9.2 10 7 12.2 7 15C7 18 9 22 12 22C15 22 17 18 17 15C17 12.2 14.8 10 12 10Z"/>
    </svg>
);

const GenderIcon = ({ gender }) =>
    gender === 'female' ? (
        <svg className="w-4 h-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="12" cy="9" r="5" />
            <path strokeLinecap="round" d="M12 14v6M9 17h6" />
        </svg>
    ) : (
        <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <circle cx="10" cy="14" r="5" />
            <path strokeLinecap="round" d="M19 5l-5 5M19 5h-5M19 5v5" />
        </svg>
    );

const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const diff = new Date() - new Date(birthDate);
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();
    if (years === 0 && months === 0) return '< 1 mês';
    if (years === 0) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
};

// 💡 Adicionamos a prop profileUrl aqui
export default function PetCard({ pet, profileUrl, onAdoptClick }) {
    const ageText = calculateAge(pet.estimated_birth_date || pet.birth_date);
    const imageSource = pet.photo_url || (pet.photo ? `/storage/${pet.photo}` : null);

    return (
        /* 💡 DE <div> PARA <Link> - O card inteiro agora é clicável */
        <Link 
            href={profileUrl} 
            className="group bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer block"
        >
            
            {/* ── Imagem do Animal ───────────────────────────────────────────── */}
            <div className="h-64 bg-gray-100 relative overflow-hidden">
                {imageSource ? (
                    <img 
                        src={imageSource} 
                        alt={pet.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/60 text-gray-300">
                        <PawIcon />
                    </div>
                )}
                
                {/* Badge de Espécie Flutuante */}
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm uppercase tracking-wide">
                    {translate.species[pet.species] ?? 'Outro'}
                </span>
            </div>

            {/* ── Informações e Conteúdo ─────────────────────────────────────── */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    {/* Linha de Título & Ícone de Gênero */}
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight truncate mr-2">
                            {pet.name}
                        </h3>
                        <div className="p-1.5 bg-gray-50 rounded-lg border border-gray-100" title={translate.gender[pet.gender]}>
                            <GenderIcon gender={pet.gender} />
                        </div>
                    </div>

                    {/* Tags com características (Idade e Porte) */}
                    <div className="flex flex-wrap gap-1.5 mb-3 text-xs font-semibold text-gray-500">
                        {ageText && <span className="px-2.5 py-1 bg-gray-100 rounded-md">{ageText}</span>}
                        {pet.size && <span className="px-2.5 py-1 bg-gray-100 rounded-md">Porte {translate.size[pet.size] ?? pet.size}</span>}
                    </div>

                    {/* Breve Descrição */}
                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 leading-relaxed">
                        {pet.description || 'Procurando um lar cheio de amor para receber e compartilhar.'}
                    </p>
                </div>

                {/* Botão de Ação Primário */}
                <button 
                    onClick={(e) => {
                        // 💡 A MÁGICA ESTÁ AQUI: Isso impede que o clique no botão ative o <Link>
                        e.preventDefault();
                        e.stopPropagation();
                        onAdoptClick();
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-bold text-sm rounded-2xl transition-all shadow-sm active:scale-[0.98]"
                >
                    Quero adotar
                </button>
            </div>
        </Link>
    );
}