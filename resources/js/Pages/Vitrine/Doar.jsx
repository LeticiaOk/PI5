import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import VitrineLayout from '@/Layouts/VitrineLayout';
import QRCode from 'react-qr-code';
import { generatePixPayload } from '@/utils/PixUtils';

export default function Doar({ slug, ong, settings }) {
    const primaryColor = settings?.primary_color || '#4f46e5'; 
    const [pixString, setPixString] = useState('');

    useEffect(() => {
        if (settings?.pix_key) {
            try {
                const payload = generatePixPayload({
                    pixKey: settings.pix_key,
                    merchantName: ong?.name || 'Doacao',
                    merchantCity: settings?.city || 'Brasil', 
                    txid: 'DOACAO'
                });
                setPixString(payload);
            } catch (error) {
                console.error("Erro ao gerar Payload PIX local:", error);
            }
        }
    }, [settings, ong]);

    const handleCopyPix = () => {
        // Copia o payload completo (Copia e Cola) se existir, senão copia a chave pura
        navigator.clipboard.writeText(pixString || settings?.pix_key);
        alert('Código PIX Copia e Cola copiado com sucesso!');
    };

    return (
        <VitrineLayout ong={ong} settings={settings}>
            <Head title={`Apoie a Causa - ${ong?.name}`} />
            
            <div className="max-w-3xl mx-auto py-16 px-4">
                
                {/* Cabeçalho de impacto */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-3">Apoie nossa causa</h1>
                    <p className="text-gray-600 text-lg">Sua contribuição transforma o destino de um animal.</p>
                </div>

                {/* Card de Doação */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">❤️</span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">Qualquer valor importa!</h2>
                    
                    {/* Bloco explicativo */}
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
                        {settings?.pix_key ? (
                            <>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Escaneie ou Copie o Código
                                </p>
                                
                                {/* QR Code Gerado Localmente */}
                                <div className="flex justify-center bg-white p-3 rounded-lg border border-gray-200 mb-5 inline-block mx-auto">
                                    {pixString ? (
                                        <QRCode 
                                            value={pixString} 
                                            size={180} 
                                            bgColor="#ffffff" 
                                            fgColor="#111827" 
                                            level="M" 
                                        />
                                    ) : (
                                        <div className="h-[180px] w-[180px] flex items-center justify-center text-xs text-gray-400">
                                            Gerando...
                                        </div>
                                    )}
                                </div>

                                <button 
                                    onClick={handleCopyPix}
                                    className="inline-flex items-center justify-center gap-2 w-full py-3 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-1-1V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    Copiar código PIX
                                </button>

                                <p className="text-xs text-gray-500 mt-4 break-all">
                                    Chave direta: <strong className="text-gray-800">{settings.pix_key}</strong>
                                </p>
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