import { Head, Link } from '@inertiajs/react';
import VitrineLayout from '@/Layouts/VitrineLayout';

export default function Doar({ slug, ong, settings }) {
    const primaryColor = settings?.primary_color || '#4f46e5'; 

    return (
        <VitrineLayout ong={ong} settings={settings}>
            <Head title={`Apoie a Causa - ${ong?.name}`} />
            
            {/* Removido o min-h-screen e bg-gray-50 para herdar o layout padrão */}
            <div className="max-w-3xl mx-auto py-16 px-4">
                
                {/* Cabeçalho de impacto */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-3">Apoie nossa causa</h1>
                    <p className="text-gray-600 text-lg">Sua contribuição transforma o destino de um animal.</p>
                </div>

                {/* Card de Doação - Fundo branco padrão */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❤️</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">Qualquer valor importa!</h2>
                    
                    {/* Bloco explicativo preenchendo o conteúdo */}
                    <div className="text-sm text-gray-600 mb-8 max-w-md mx-auto space-y-3 leading-relaxed">
                        <p>
                            Manter o abrigo exige custos diários com <strong>alimentação, medicamentos e atendimento veterinário</strong>. 
                        </p>
                        <p>
                            Sua doação de qualquer valor é revertida diretamente para o bem-estar dos nossos animais. 
                            <strong> Agradecemos por fazer parte dessa corrente do bem.</strong>
                        </p>
                    </div>

                    {/* Área PIX Dinâmica */}
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-8 max-w-sm mx-auto">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Chave Pix (E-mail)
                        </p>
                        
                        {settings?.public_email ? (
                            <>
                                <p className="font-mono font-bold text-gray-800 break-all mb-5 text-lg" style={{ color: primaryColor }}>
                                    {settings.public_email}
                                </p>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(settings.public_email)}
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all active:scale-95"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-1-1V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Copiar chave PIX
                                </button>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 italic py-4">
                                Chave PIX não configurada pela instituição.
                            </p>
                        )}
                    </div>

                    <Link 
                        href={route('vitrine.home', { slug })} 
                        className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        </VitrineLayout>
    );
}