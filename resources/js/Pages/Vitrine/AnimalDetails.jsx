import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdoptionModal from '@/Components/Vitrine/AdoptionModal'; 

export default function AnimalDetails({ animal, slug }) {
    const { tenant } = usePage().props;
    const primaryColor = tenant?.settings?.primary_color;

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fallback de imagem
    const imageSource = animal.photo_url || (animal.photo_path ? `/storage/${animal.photo_path}` : null);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title={`Conheça ${animal.name}`} />
            
            <div className="max-w-5xl mx-auto">
                <Link href={`/${slug}/adote`} className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                    ← Voltar para a vitrine
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    {/* Imagem em Destaque */}
                    <div className="h-96 md:h-auto bg-gray-200">
                        {imageSource ? (
                            <img src={imageSource} alt={animal.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">🐾</div>
                        )}
                    </div>

                    {/* Informações */}
                    <div className="p-8 md:p-12 space-y-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2">{animal.name}</h1>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 text-white text-xs font-bold rounded-full uppercase" style={{ backgroundColor: primaryColor }}>{animal.species}</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase">{animal.size}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-6">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Gênero</p>
                                <p className="font-semibold text-gray-900 capitalize">{animal.gender}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Peso</p>
                                <p className="font-semibold text-gray-900">{animal.weight ? `${animal.weight}kg` : 'Não informado'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Castrado?</p>
                                <p className={`font-bold ${animal.is_neutered ? 'text-emerald-600' : 'text-red-600'}`}>{animal.is_neutered ? 'Sim' : 'Não'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Vacinado?</p>
                                <p className={`font-bold ${animal.is_vaccinated ? 'text-emerald-600' : 'text-red-600'}`}>{animal.is_vaccinated ? 'Sim' : 'Não'}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-gray-900 mb-3">Sobre {animal.name}</h2>
                            <p className="text-gray-600 leading-relaxed italic">
                                "{animal.description || 'Este animalzinho ainda não possui uma descrição detalhada, mas está pronto para receber muito amor!'}"
                            </p>
                        </div>

                        {/* Botão que dispara o Modal local */}
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="w-full flex justify-center py-4 px-6 text-white font-bold rounded-2xl transition-all shadow-lg"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Quero adotar!
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Adoção integrado */}
            {isModalOpen && (
                <AdoptionModal 
                    pet={animal} 
                    slug={slug} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}