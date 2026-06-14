// resources/js/Layouts/VitrineLayout.jsx

import Header from '@/Components/Vitrine/Header';
import { usePage } from '@inertiajs/react';

export default function VitrineLayout({ children }) {
    // Captura os dados globais compartilhados pelo Inertia
    const { props } = usePage();
    
    const slug = props.slug; 
    const settings = props.settings; // Captura as configurações dinâmicas da ONG

    return (
        <div className="min-h-screen bg-[#F4F2ED] text-gray-900 flex flex-col">
            {/* Header Global */}
            <Header slug={slug} />

            {/* Conteúdo Principal (Sem paddings horizontais rígidos para colar na tela se preciso) */}
            <main>
                {children}
            </main>

            {/* ── FOOTER GLOBAL COM REDES SOCIAIS E CONTATO ────────────────── */}
            <footer className="py-12 bg-gray-50 text-center border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Links de Redes Sociais */}
                    <div className="flex justify-center gap-6 mb-6">
                        {settings?.facebook_url && (
                            <a
                                href={settings.facebook_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-blue-600 font-bold transition-colors"
                            >
                                Facebook
                            </a>
                        )}
                        {settings?.instagram_url && (
                            <a
                                href={settings.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-gray-600 hover:text-pink-600 font-bold transition-colors"
                            >
                                Instagram
                            </a>
                        )}
                    </div>

                    {/* Botão do WhatsApp com trava de privacidade */}
                    {settings?.public_whatsapp && settings?.display_whatsapp && (
                        <div className="mb-8">
                            <a
                                href={`https://wa.me/55${settings.public_whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm shadow-green-100"
                            >
                                💬 Falar pelo WhatsApp
                            </a>
                        </div>
                    )}

                    
                </div>
            </footer>
        </div>
    );
}