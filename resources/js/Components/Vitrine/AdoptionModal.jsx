// resources/js/Components/Vitrine/AdoptionModal.jsx

import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AdoptionModal({ pet, slug, onClose }) {
    // Estado interno para controlar se exibe o formulário ou a tela de sucesso
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Inicialização do estado do formulário
    const { data, setData, post, processing, errors, reset } = useForm({
        adopter_name: '',
        adopter_email: '',
        adopter_phone: '',
        terms_accepted: false, 
        accepts_marketing: false, 
    });

    const submit = (e) => {
        e.preventDefault();
        
        post(route('vitrine.adote.store', { 
            slug: slug, 
            animal_uuid: pet.id 
        }), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsSubmitted(true); // Ativa o feedback visual elegante
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-fade-in">
            {/* Clique fora do modal para fechar voluntariamente */}
            <div className="absolute inset-0" onClick={onClose} />

            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative z-10 overflow-hidden transform transition-all duration-300">
                
                {/* Botão Fechar de Canto */}
                <button 
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors font-medium"
                    aria-label="Fechar"
                >
                    ✕
                </button>

                {!isSubmitted ? (
                    /* ── TELA 1: FORMULÁRIO DE INTERESSE ─────────────────────── */
                    <>
                        <div className="mb-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 mb-2">
                                💌 Formulário de Interesse
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                Adotar o(a) <span className="text-indigo-600">{pet.name}</span>
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                Deixe seus dados de contato abaixo. A equipe responsável analisará seu perfil e retornará o quanto antes!
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label htmlFor="adopter_name" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Nome Completo
                                </label>
                                <input
                                    id="adopter_name"
                                    type="text"
                                    placeholder="Ex: João Silva"
                                    className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-400 ${
                                        errors.adopter_name ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'
                                    }`}
                                    value={data.adopter_name}
                                    onChange={e => setData('adopter_name', e.target.value)}
                                    required
                                />
                                {errors.adopter_name && (
                                    <span className="flex items-center gap-1 text-red-500 text-xs font-semibold mt-1">
                                        ⚠️ {errors.adopter_name}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="adopter_email" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    E-mail de Contato
                                </label>
                                <input
                                    id="adopter_email"
                                    type="email"
                                    placeholder="seuemail@exemplo.com"
                                    className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-400 ${
                                        errors.adopter_email ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'
                                    }`}
                                    value={data.adopter_email}
                                    onChange={e => setData('adopter_email', e.target.value)}
                                    required
                                />
                                {errors.adopter_email && (
                                    <span className="flex items-center gap-1 text-red-500 text-xs font-semibold mt-1">
                                        ⚠️ {errors.adopter_email}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="adopter_phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                    Telefone (WhatsApp)
                                </label>
                                <input
                                    id="adopter_phone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    className={`w-full px-4 py-3 text-sm border rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium placeholder:text-gray-400 ${
                                        errors.adopter_phone ? 'border-red-300 ring-1 ring-red-300' : 'border-gray-200'
                                    }`}
                                    value={data.adopter_phone}
                                    onChange={e => setData('adopter_phone', e.target.value)}
                                    required
                                />
                                {errors.adopter_phone && (
                                    <span className="flex items-center gap-1 text-red-500 text-xs font-semibold mt-1">
                                        ⚠️ {errors.adopter_phone}
                                    </span>
                                )}
                            </div>

                            {/* CHECKBOX 1: TERMOS (Obrigatório) */}
                            <div className="flex items-start mt-4">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        required
                                        checked={data.terms_accepted}
                                        onChange={(e) => setData('terms_accepted', e.target.checked)}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                                    />
                                </div>
                                <label htmlFor="terms" className="ml-2 text-xs text-gray-500 leading-tight">
                                    Li e aceito os <a href="#" className="text-indigo-600 hover:underline">Termos de Uso</a> e autorizo o uso dos meus dados para este processo. <span className="text-red-500">*</span>
                                </label>
                            </div>
                            {errors.terms_accepted && <p className="text-red-500 text-xs mt-1">{errors.terms_accepted}</p>}

                            {/* CHECKBOX 2: MARKETING (Opcional) */}
                            <div className="flex items-start mt-2 mb-2">
                                <div className="flex items-center h-5">
                                    <input
                                        id="marketing"
                                        type="checkbox"
                                        checked={data.accepts_marketing}
                                        onChange={(e) => setData('accepts_marketing', e.target.checked)}
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-indigo-500 text-indigo-600"
                                    />
                                </div>
                                <label htmlFor="marketing" className="ml-2 text-xs text-gray-500 leading-tight">
                                    Aceito receber novidades e campanhas de parceiros da plataforma. (Opcional)
                                </label>
                            </div>

                            <div className="pt-2 flex flex-col sm:flex-row-reverse gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 active:scale-[0.98]"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Enviando...
                                        </span>
                                    ) : (
                                        'Confirmar Interesse ✨'
                                    )}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-2xl transition-all active:scale-[0.98]"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    /* ── TELA 2: DESIGN DE FEEDBACK VISUAL DE SUCESSO ────────────── */
                    <div className="text-center py-6 animate-scale-up">
                        {/* Ícone Animado/Estilizado com círculos concêntricos */}
                        <div className="mx-auto mb-6 relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-green-100/60 animate-ping opacity-75" style={{ animationDuration: '2s' }} />
                            <span className="text-4xl relative z-10">🎉</span>
                        </div>

                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            Solicitação Enviada!
                        </h2>
                        
                        <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto leading-relaxed">
                            Obrigado pelo interesse em adotar o(a) <strong>{pet.name}</strong>! Seus dados foram salvos com sucesso e enviados para a ONG.
                        </p>

                        <div className="mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 text-left space-y-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Próximos passos:</h4>
                            <ul className="text-xs text-gray-600 space-y-1.5 list-disc pl-4 leading-normal">
                                <li>Nossa equipe avaliará as informações recebidas.</li>
                                <li>Entraremos em contato pelo WhatsApp ou E-mail fornecido.</li>
                                <li>Fique atento aos seus canais de comunicação digitais!</li>
                            </ul>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-8 w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-indigo-100 transition-all active:scale-[0.98]"
                        >
                            Voltar para a Vitrine
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}