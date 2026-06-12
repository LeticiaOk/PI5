import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import PetCard from '@/Components/Vitrine/PetCard';
import AdoptionModal from '@/Components/Vitrine/AdoptionModal';

const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
);

export default function Adote({ pets = [], slug }) {
    const { tenant } = usePage().props;
    const settings = tenant.settings; 
    
    const primaryColor = settings.primary_color; 
    const heroTitle = settings.hero_title;
    const heroSubtitle = settings.hero_subtitle;
    const ongName = tenant.name;

    const [selectedPet, setSelectedPet] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedSpecies, setSelectedSpecies] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');

    const filteredPets = useMemo(() => {
        const petList = Array.isArray(pets) ? pets : (pets.data || []);

        return petList.filter((pet) => {
            const speciesText = pet.species === 'dog' ? 'cachorro' : pet.species === 'cat' ? 'gato' : String(pet.species).toLowerCase();
            const matchesSearch = pet.name?.toLowerCase().includes(search.toLowerCase()) || speciesText.includes(search.toLowerCase());
            const matchesSpecies = selectedSpecies === 'all' || pet.species === selectedSpecies;
            const matchesSize = selectedSize === 'all' || pet.size === selectedSize;

            return matchesSearch && matchesSpecies && matchesSize;
        });
    }, [pets, search, selectedSpecies, selectedSize]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 antialiased font-sans pb-12">
            <Head title={`Adote - ${ongName}`} />

            {/* ── HERO BANNER DINÂMICO ───────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 sm:py-24 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left space-y-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                            🐾 Adote um Amor para a Vida Toda
                        </span>
                        
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                            {heroTitle}
                        </h1>
                        
                        <p className="text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed whitespace-pre-line">
                            {heroSubtitle}
                        </p>
                    </div>

                    <div className="hidden lg:grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <div className="space-y-4 pt-8">
                            <div className="h-40 rounded-3xl p-6 text-white flex flex-col justify-end shadow-lg" style={{ backgroundColor: primaryColor, boxShadow: `0 10px 25px -5px ${primaryColor}50` }}>
                                <span className="text-3xl font-black">+{pets.total || (Array.isArray(pets) ? pets.length : pets.data?.length) || 0}</span>
                                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Aguardando lar</span>
                            </div>
                            <div className="bg-white border border-gray-100 h-32 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                                <span className="text-2xl">🐶🐱</span>
                                <span className="text-xs font-bold text-gray-400 mt-2 uppercase">100% Castrados</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white border border-gray-100 h-36 rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
                                <span className="text-2xl">🩺</span>
                                <span className="text-xs font-bold text-gray-400 mt-2 uppercase">Vacinados e Protegidos</span>
                            </div>
                            <div className="bg-purple-600 h-36 rounded-3xl p-6 text-white flex flex-col justify-end shadow-lg shadow-purple-200">
                                <span className="text-xl font-bold leading-tight">Amor Puro</span>
                                <span className="text-xs opacity-80">Não tem preço, adote!</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FILTROS E BUSCA ────────────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2"><SearchIcon /></span>
                        <input
                            type="text"
                            placeholder="Buscar por nome ou espécie..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 transition-all placeholder:text-gray-400 font-medium outline-none"
                            style={{ '--tw-ring-color': primaryColor }}
                        />
                    </div>
                    <div>
                        <select
                            value={selectedSpecies}
                            onChange={(e) => setSelectedSpecies(e.target.value)}
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 transition-all font-medium text-gray-600 outline-none"
                            style={{ '--tw-ring-color': primaryColor }}
                        >
                            <option value="all">Todas as Espécies</option>
                            <option value="dog">Cachorros</option>
                            <option value="cat">Gatos</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 transition-all font-medium text-gray-600 outline-none"
                            style={{ '--tw-ring-color': primaryColor }}
                        >
                            <option value="all">Todos os Portes</option>
                            <option value="small">Porte Pequeno (P)</option>
                            <option value="medium">Porte Médio (M)</option>
                            <option value="large">Porte Grande (G)</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end lg:justify-center px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30`, color: primaryColor }}>
                        {filteredPets.length === 1 ? '1 amigo encontrado' : `${filteredPets.length} amigos encontrados`}
                    </div>
                </div>
            </section>

            {/* ── LISTAGEM DE ANIMAIS ─────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {filteredPets.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <span className="text-5xl block mb-4">🔍</span>
                        <h3 className="text-lg font-bold text-gray-800">Nenhum animal correspondente</h3>
                        <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
                            Tente ajustar seus filtros ou limpar a barra de pesquisa para ver mais animais.
                        </p>
                        <button 
                            onClick={() => { setSearch(''); setSelectedSpecies('all'); setSelectedSize('all'); }} 
                            className="mt-4 text-sm font-semibold underline"
                            style={{ color: primaryColor }}
                        >
                            Limpar filtros
                        </button>
                    </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPets.map((pet) => (
                            <PetCard 
                                key={pet.uuid} 
                                pet={pet} 
                                profileUrl={`/${slug}/animal/${pet.id}`}
                                onAdoptClick={() => setSelectedPet(pet)} 
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Modal de Adoção onde o Formulário realmente fica! */}
            {selectedPet && (
                <AdoptionModal 
                    pet={selectedPet} 
                    slug={slug} 
                    onClose={() => setSelectedPet(null)} 
                />
            )}
        </div>
    );
}