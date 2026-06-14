import React from "react";
import VitrineLayout from "@/Layouts/VitrineLayout";

import { Head, Link } from "@inertiajs/react";

// Helpers de tradução idênticos ao Show.jsx para manter a consistência de dados
const translate = {
    species: { dog: "Cachorro", cat: "Gato", other: "Outro" },
    gender: { male: "Macho", female: "Fêmea" },
    size: { small: "Pequeno (P)", medium: "Médio (M)", large: "Grande (G)" },
};

const calculateAge = (birthDate) => {
    if (!birthDate) return "Idade desconhecida";
    const diff = new Date() - new Date(birthDate);
    const ageDate = new Date(diff);
    const years = Math.abs(ageDate.getUTCFullYear() - 1970);
    const months = ageDate.getUTCMonth();
    if (years === 0 && months === 0) return "< 1 mês";
    if (years === 0) return `${months} ${months === 1 ? "mês" : "meses"}`;
    return `${years} ${years === 1 ? "ano" : "anos"}`;
};

export default function Adote({ slug, pets, settings }) {
    // Cores e configurações vindas do banco (Padrão Home.jsx)
    const primaryColor = settings?.primary_color || "#FF5733";
    const heroBgColor = settings?.hero_background_color || "#0f172a";

    return (
        <VitrineLayout>
            <div className="min-h-screen bg-white font-sans">
                <Head title="Animais para Adoção" />

                {/* HEADER DA VITRINE */}
                <section
                    className="relative w-full py-20 flex items-center justify-center text-center"
                    style={{ backgroundColor: heroBgColor }}
                >
                    <div className="relative z-10 px-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                            Encontre seu{" "}
                            <span style={{ color: primaryColor }}>
                                Novo Amigo
                            </span>
                        </h1>
                        <p className="text-lg text-slate-200 max-w-xl mx-auto font-medium drop-shadow">
                            Todos esses focinhos estão vacinados, cuidados e
                            ansiosos por um lar cheio de amor.
                        </p>
                    </div>
                </section>

                {/* CONTEÚDO PRINCIPAL (GRID DE ANIMAIS) */}
                <main className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {pets.data.length === 0 ? (
                        <div className="text-center py-16 bg-slate-50 rounded-[3rem] p-12 border border-dashed border-slate-200">
                            <span className="text-4xl">🐾</span>
                            <h3 className="text-xl font-bold text-slate-700 mt-4">
                                Nenhum animal disponível no momento
                            </h3>
                            <p className="text-slate-500 mt-2">
                                Todos os nossos peludos foram adotados ou
                                estamos preparando novos dossiês!
                            </p>
                        </div>
                    ) : (
                        <>
                        {/* GRID */}
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {pets.data.map((pet) => (
                                    <div
                                        key={pet.id}
                                        className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                                    >
                                        {/* Imagem do Pet */}
                                        <div className="relative h-64 w-full overflow-hidden bg-gray-200 border-b border-[#538BA8]/10">
                                            {pet.photo_url ? (
                                                <img
                                                    src={pet.photo_url}
                                                    alt={pet.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-5xl select-none">
                                                    🐾
                                                </div>
                                            )}

                                            {/* Tag de Espécie no topo da foto */}
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#000000] shadow-sm border border-[#538BA8]/10">
                                                {translate.species[
                                                    pet.species
                                                ] || "Outro"}
                                            </div>
                                        </div>

                                        {/* Informações do Pet */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                                                        {pet.name}
                                                    </h2>
                                                    <span className="text-sm font-semibold text-slate-500">
                                                        {
                                                            translate.gender[
                                                                pet.gender
                                                            ]
                                                        }
                                                    </span>
                                                </div>

                                                {/* Características Críticas inline */}
                                                <p className="text-sm text-slate-500 font-medium mb-4">
                                                    {calculateAge(
                                                        pet.estimated_birth_date,
                                                    )}{" "}
                                                    • {translate.size[pet.size]}
                                                </p>

                                                {/* Raça vinda do relacionamento no Controller */}
                                                {pet.breed && (
                                                    <div className="inline-block bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 text-xs text-slate-600 font-bold mb-4">
                                                        {pet.breed.name}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Botão de Link para Detalhes */}
                                            <Link
                                                href={route(
                                                    "vitrine.animal.show",
                                                    [slug, pet.id],
                                                )}
                                                className="w-full py-3.5 rounded-xl font-bold text-white text-center block transition-all group-hover:opacity-95 shadow-md"
                                                style={{
                                                    backgroundColor:
                                                        "#111827",
                                                }}
                                            >
                                                Quero Conhecer
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* PAGINAÇÃO DE ACORDO COM O LARAVEL PAGINATE */}
                            {pets.links && pets.links.length > 3 && (
                                <div className="mt-16 flex justify-center gap-2">
                                    {pets.links.map((link, index) => {
                                        if (link.url === null) return null;
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                                                    link.active
                                                        ? "text-white border-transparent shadow-md"
                                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                                }`}
                                                style={
                                                    link.active
                                                        ? {
                                                              backgroundColor:
                                                                  primaryColor,
                                                          }
                                                        : {}
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </main>

                {/* FOOTER CTA IGUAL AO DA HOME */}
                <section className="py-16 px-4 bg-slate-50/50 border-t border-slate-100">
                    <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-16 text-center">
                        <h2 className="text-2xl md:text-4xl font-black text-white mb-6">
                            Não encontrou o que procurava?
                            <br />
                            <span style={{ color: primaryColor }}>
                                Você ainda pode nos apoiar e salvar vidas.
                            </span>
                        </h2>
                        <Link
                            href={route("vitrine.doar", slug)}
                            className="inline-block px-10 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
                        >
                            Ver formas de ajudar ❤️
                        </Link>
                    </div>
                </section>
            </div>
        </VitrineLayout>
    );
}
