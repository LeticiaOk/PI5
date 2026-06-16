import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function VolunteerModal({ slug, ongName, onClose }) {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', email: '', phone: '', notes: '', terms_accepted: false,
    });

    const formatPhone = (value) => {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 15);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('vitrine.volunteers.store', { slug: slug }), {
            preserveScroll: true,
            onSuccess: () => { reset(); setIsSubmitted(true); },
        });
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="flex min-h-full items-start justify-center p-4 sm:items-center sm:p-0">
                <div className="fixed inset-0 bg-gray-900/80 transition-opacity" onClick={onClose} />

                <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 my-8 animate-fade-in text-left">
                    <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors font-medium z-10">✕</button>

                    {!isSubmitted ? (
                        <>
                            <div className="mb-6 pr-6">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 mb-2">🤝 Rede de Apoio</span>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Seja um Voluntário</h2>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    Junte-se à <strong>{ongName}</strong>!
                                </p>
                                 <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                                    Preencha o formulário abaixo com seus dados.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Nome Completo</label>
                                    <input type="text" placeholder="Ex: Maria Silva" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium" value={data.name} onChange={e => setData('name', e.target.value)} required />
                                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">WhatsApp</label>
                                        <input type="tel" inputMode="numeric" placeholder="(00) 00000-0000" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium" value={data.phone} onChange={e => setData('phone', formatPhone(e.target.value))} required />
                                        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">E-mail (Opcional)</label>
                                        <input type="email" placeholder="seu@email.com" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium" value={data.email} onChange={e => setData('email', e.target.value)} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Como você gostaria de ajudar?</label>
                                    <textarea rows="3" placeholder="Ex: Posso dar lar temporário, ajudar em eventos..." className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all font-medium resize-none" value={data.notes} onChange={e => setData('notes', e.target.value)} required></textarea>
                                </div>

                                {/* 🔥 CHECKBOX MELHORADO E CLICÁVEL PELO TEXTO */}
                                <div className="flex items-start mt-4">
                                    <div className="flex items-center h-5">
                                        <input id="terms" type="checkbox" required checked={data.terms_accepted} onChange={(e) => setData('terms_accepted', e.target.checked)} className="w-4 h-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                                    </div>
                                    <label htmlFor="terms" className="ml-2 text-xs text-gray-500 leading-tight cursor-pointer">
                                        Li e aceito os <span className="text-gray-900 font-semibold underline">Termos de Uso</span> e autorizo o contato da ONG através dos dados fornecidos. <span className="text-red-500">*</span>
                                    </label>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row-reverse gap-3">
                                    <button type="submit" disabled={processing} className="flex-1 py-3.5 px-4 bg-gray-900 text-white text-sm font-bold rounded-2xl shadow-sm transition-all disabled:opacity-60">{processing ? 'Enviando...' : 'Enviar Solicitação'}</button>
                                    <button type="button" onClick={onClose} className="px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-2xl transition-all">Cancelar</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-scale-up">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Solicitação Enviada! 🎉</h2>
                            <p className="text-sm text-gray-500 mt-3 mb-6">A ONG <strong>{ongName}</strong> recebeu sua solicitação e entrará em contato pelo WhatsApp em breve.</p>
                            <button onClick={onClose} className="w-full py-3.5 px-4 bg-gray-900 text-white text-sm font-bold rounded-2xl">Voltar para a Vitrine</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (!mounted) return null;
    return createPortal(modalContent, document.body);
}