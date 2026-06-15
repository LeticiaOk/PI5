import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const FeatureIcon = ({ path }) => (
    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    </div>
);

const PartnerMark = ({ path }) => (
    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-400">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={path} />
        </svg>
    </div>
);

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
    <div className="border-b border-slate-200">
        <button
            type="button"
            onClick={onToggle}
            className="w-full flex items-center justify-between gap-4 py-6 text-left"
            aria-expanded={isOpen}
        >
            <span className="text-lg font-bold text-slate-900">{question}</span>
            <span
                className={`flex-shrink-0 w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-45 border-indigo-600 text-indigo-600' : ''
                }`}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
            </span>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            <p className="pb-6 text-slate-600 leading-relaxed pr-12">{answer}</p>
        </div>
    </div>
);

export default function Welcome({ auth }) {
    const [openFaq, setOpenFaq] = useState(0);
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        ong_name: '',
        email: '',
        phone: '', 
        terms_accepted: false, 
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('landing.lead.store'), {
            preserveScroll: true,
            onSuccess: () => reset(), 
        });
    };

    const steps = [
        {
            number: '01',
            title: 'Peça o seu acesso',
            description: 'Conte um pouco sobre o trabalho que realiza. Em até 1 dia útil, liberamos a sua entrada na plataforma.',
            icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
        },
        {
            number: '02',
            title: 'Apoio nos primeiros passos',
            description: 'A nossa equipa ajuda-o a registar os primeiros animais e itens para a sua página já nascer pronta.',
            icon: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7.712 7.712 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z',
        },
        {
            number: '03',
            title: 'Tudo num só lugar',
            description: 'Stock, adoções, lares temporários e voluntários — tudo organizado e conectado com o seu site público.',
            icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2',
        },
    ];

    const faqs = [
        {
            question: 'O sistema é gratuito?',
            answer: 'Durante o período de convites, a Fourster é gratuita para ONGs e cuidadores independentes. Conforme o produto evolui, avisaremos com antecedência sobre qualquer mudança de plano.',
        },
        {
            question: 'Preciso de formação para usar?',
            answer: 'Não. Durante a configuração assistida, ajudamos a registar os seus primeiros animais, itens e voluntários, e já sai a usar. A interface foi pensada para quem tem pouco tempo livre.',
        },
        {
            question: 'Os meus dados estão seguros?',
            answer: 'Sim. Cada ONG tem o seu próprio espaço isolado dentro da plataforma, com acesso restrito apenas à sua equipa. Você decide o que aparece publicamente na sua página de adoção.',
        },
        {
            question: 'A página pública fica no meu domínio?',
            answer: 'A sua ONG recebe uma página própria com endereço exclusivo, no formato suaong.fourster.com.br, com cores e banners personalizáveis de forma visual — sem precisar de configurações complexas.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans scroll-smooth">
            <Head title="Fourster | Gestão Organizada para ONGs" />

            {/* NAVBAR */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img 
                            src="/images/logo.png" 
                            alt="Logo Fourster" 
                            className="h-10 w-auto" 
                        />
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Recursos</a>
                        <a href="#como-funciona" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Como funciona</a>
                        <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Dúvidas</a>
                        <a href="#contato" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Pedir Acesso</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="text-sm font-bold text-indigo-600">Painel &rarr;</Link>
                        ) : (
                            <Link href={route('login')} className="text-sm font-bold text-slate-900 hover:text-indigo-600">Entrar</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <main className="pt-40 pb-24 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight mb-8">
                        Organize o dia a dia da sua ONG <br />
                        <span className="text-indigo-600">sem complicação.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10">
                        Do controlo de ração aos peludos para adoção: gerencie tudo em um só lugar e tenha sua própria página pública atualizada automaticamente.
                    </p>
                    <a href="#contato" className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">Pedir meu acesso</a>
                </div>
            </main>

            {/* FEATURES */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                        <FeatureIcon path="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        <h3 className="text-xl font-bold mb-3">Controle Prático de Estoque</h3>
                        <p className="text-slate-600">Receba avisos antes que a ração ou os medicamentos acabem, sem precisar lidar com planilhas complexas.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                        <FeatureIcon path="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        <h3 className="text-xl font-bold mb-3">Tudo Conectado</h3>
                        <p className="text-slate-600">Cadastrou um animalzinho no painel? Ele já aparece na sua página de adoção na mesma hora, sem retrabalho.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                        <FeatureIcon path="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        <h3 className="text-xl font-bold mb-3">Sua Própria Página</h3>
                        <p className="text-slate-600">Tenha um site com o nome e as cores do seu projeto. Troque fotos e textos de um jeito visual e super fácil.</p>
                    </div>
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section id="como-funciona" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Do acesso à adoção, em três passos</h2>
                        <p className="text-lg text-slate-600">Pensado para equipas pequenas e voluntários — sem complicação técnica.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {steps.map((step, index) => (
                            <div key={step.number} className="relative p-8 rounded-2xl bg-white border border-slate-100">
                                <span className="text-sm font-black text-indigo-200 tracking-widest">{step.number}</span>
                                <FeatureIcon path={step.icon} />
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-slate-600">{step.description}</p>
                                {index < steps.length - 1 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 items-center justify-center text-slate-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARCEIROS / SOCIAL PROOF */}
            <section id="parceiros" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-12">
                        ONGs parceiras pelo país
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
                        <PartnerMark path="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        <PartnerMark path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        <PartnerMark path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        <PartnerMark path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <PartnerMark path="M12 8v8m-4-4h8m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">Perguntas frequentes</h2>
                        <p className="text-lg text-slate-600">Tudo o que ONGs e cuidadores costumam perguntar antes de começar.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 px-6 sm:px-8">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openFaq === index}
                                onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTATO */}
            <section id="contato" className="py-20 bg-slate-900 text-white">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-4 text-center">Vamos organizar tudo juntos?</h2>
                    <p className="text-slate-400 text-sm text-center mb-8">Deixe os seus contactos abaixo para conhecermos o seu trabalho e liberarmos o seu acesso.</p>

                    {flash?.success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 text-emerald-400 rounded-xl font-semibold border border-emerald-500/20 text-sm animate-fade-in">
                            🎉 {flash.success}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={submit}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input 
                                    className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500" 
                                    placeholder="Seu Nome" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-1">⚠️ {errors.name}</p>}
                            </div>
                            <div>
                                <input 
                                    className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500" 
                                    placeholder="Nome da ONG (Opcional)" 
                                    value={data.ong_name}
                                    onChange={e => setData('ong_name', e.target.value)}
                                />
                                {errors.ong_name && <p className="text-red-400 text-xs mt-1">⚠️ {errors.ong_name}</p>}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <input 
                                    className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500" 
                                    type="email" 
                                    placeholder="Seu E-mail" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-1">⚠️ {errors.email}</p>}
                            </div>
                            <div>
                                <input 
                                    className="w-full p-3 bg-slate-800 rounded-lg border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500" 
                                    type="tel" 
                                    placeholder="WhatsApp (com DDD)" 
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    required
                                />
                                {errors.phone && <p className="text-red-400 text-xs mt-1">⚠️ {errors.phone}</p>}
                            </div>
                        </div>

                        {/* CHECKBOX OBRIGATÓRIO DA LGPD */}
                        <div className="flex items-start pt-2">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    checked={data.terms_accepted}
                                    onChange={e => setData('terms_accepted', e.target.checked)}
                                    className="w-4 h-4 border border-slate-700 rounded bg-slate-800 focus:ring-offset-slate-900 focus:ring-indigo-500 text-indigo-600"
                                />
                            </div>
                            <label htmlFor="terms" className="ml-2 text-xs text-slate-400 leading-tight select-none">
                                Aceito os <a href="#" className="text-indigo-400 hover:underline">Termos de Uso</a> e autorizo a Fourster a armazenar os meus dados para contacto e análise de perfil. <span className="text-red-400">*</span>
                            </label>
                        </div>
                        {errors.terms_accepted && <p className="text-red-400 text-xs mt-1">⚠️ {errors.terms_accepted}</p>}

                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-indigo-600 font-bold rounded-lg hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 text-sm flex items-center justify-center"
                        >
                            {processing ? 'A enviar solicitação...' : 'Enviar solicitação'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}