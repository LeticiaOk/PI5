import React from 'react';

export default function Footer({ settings = {}, tenantName = 'Instituição' }) {
    const primaryColor = settings.primary_color || '#4f46e5';

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                    
                    {/* Bloco 1: Identidade da Instituição */}
                    <div className="text-center md:text-left space-y-3">
                        <span className="text-3xl select-none">🐾</span>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight">
                            {tenantName}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto md:mx-0 leading-relaxed">
                            Transformando vidas e conectando corações. Cada adoção é um recomeço.
                        </p>
                    </div>

                    {/* Bloco 2: Contato Seguro (WhatsApp Privado) */}
                    <div className="text-center flex flex-col items-center justify-center">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Fale Conosco
                        </h4>
                        
                        {/* A TRAVA DE PRIVACIDADE: Só exibe se tiver o número E a permissão marcada no CMS */}
                        {settings.public_whatsapp && settings.display_whatsapp ? (
                            <a
                                href={`https://wa.me/55${settings.public_whatsapp.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.745.448 3.39 1.238 4.825L2 22l5.35-1.39C8.75 21.28 10.334 21.75 12 21.75c5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.25c-1.503 0-2.955-.386-4.234-1.116l-.304-.173-3.14.815.834-3.064-.19-.31A8.204 8.204 0 0 1 3.75 12c0-4.55 3.7-8.25 8.25-8.25s8.25 3.7 8.25 8.25-3.7 8.25-8.25 8.25z"/></svg>
                                Fale com a gente
                            </a>
                        ) : (
                            <span className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs font-semibold text-gray-400">
                                Atendimento presencial ou via e-mail.
                            </span>
                        )}
                    </div>

                    {/* Bloco 3: Redes Sociais */}
                    <div className="text-center md:text-right flex flex-col items-center md:items-end">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                            Acompanhe
                        </h4>
                        {(settings.facebook_url || settings.instagram_url) ? (
                            <div className="flex gap-4">
                                {settings.facebook_url && (
                                    <a
                                        href={settings.facebook_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                                        aria-label="Facebook"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                                    </a>
                                )}
                                {settings.instagram_url && (
                                    <a
                                        href={settings.instagram_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-400 hover:bg-pink-50 hover:text-pink-600 transition-all"
                                        aria-label="Instagram"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                    </a>
                                )}
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">Sem redes sociais ativas.</span>
                        )}
                    </div>

                </div>

                {/* Área Inferior: Copyright e Assinatura do SaaS */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 mt-12 border-t border-gray-100 text-xs text-gray-400 font-medium">
                    
                    {/* Direitos da Instituição */}
                    <div className="text-center md:text-left">
                        &copy; {new Date().getFullYear()} {tenantName}. Todos os direitos reservados.
                    </div>

                    {/* Assinatura do seu SaaS (Marketing Orgânico) com a cor da ONG */}
                    <div className="text-center md:text-right flex items-center justify-center gap-1.5">
                        <span>Tecnologia para instituições por</span>
                        <a 
                            href="https://4fosters.com" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-black hover:opacity-70 transition-colors"
                            style={{ color: primaryColor }}
                        >
                            4Fosters
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}