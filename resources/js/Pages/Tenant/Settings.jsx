import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Settings({ auth, settings, ongLogo }) {
    const { flash } = usePage().props;
    const [logoPreview, setLogoPreview] = useState(ongLogo);

    useEffect(() => {
        return () => {
            if (logoPreview?.startsWith('blob:')) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview]);

    const [showFlash, setShowFlash] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', 
        primary_color: settings.primary_color || '#4f46e5',
        hero_subtitle: settings.hero_subtitle || '',
        about_text: settings.about_text || '',
        public_whatsapp: settings.public_whatsapp || '',
        public_email: settings.public_email || '',
        display_whatsapp: !!settings.display_whatsapp, 
        manual_saved_count: settings.manual_saved_count || 0,
        manual_volunteers_count: settings.manual_volunteers_count || 0,
        hero_background_color: settings.hero_background_color || '#0f172a',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        
        logo_path: null,
        hero_image_url: null, 
        about_photo_1: null,
        about_photo_2: null,
        
        remove_logo: false,
        remove_hero_image: false,
        remove_about_photo_1: false,
        remove_about_photo_2: false,
    });

    const hasErrors = Object.keys(errors).length > 0;

    // EFEITO: Sempre que chegar uma mensagem de sucesso, mostra por 4 segundos e esconde
    useEffect(() => {
        if (flash?.success) {
            setShowFlash(true);
            const timer = setTimeout(() => setShowFlash(false), 4000);
            return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
        }
    }, [flash]);

    const submit = (e) => {
        e.preventDefault();
        setShowFlash(false); // Esconde a antiga antes de salvar novamente
        post(route('tenant.settings.update'), {
            preserveScroll: true,
            forceFormData: true, 
        });
    };

   const handleRemoveImage = (field) => {
        if (window.confirm('Tem certeza que deseja remover esta imagem? Ela será apagada definitivamente ao salvar as alterações.')) {
            setData(field, true);
            if (field === 'remove_logo') setLogoPreview(null); 
        }
    };

    const handlePhoneMask = (e) => {
        let v = e.target.value.replace(/\D/g, ""); 
        if (v.length > 11) v = v.slice(0, 11); 
        
        let formatted = v;
        if (v.length > 2) {
            formatted = `(${v.slice(0, 2)}) ${v.slice(2)}`;
        }
        if (v.length > 6) {
            if (v.length === 11) {
                formatted = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`; 
            } else {
                formatted = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`; 
            }
        }
        setData('public_whatsapp', formatted);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configurações da Vitrine Pública</h2>}
        >
            <Head title="Configurações do Site" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        
                        {/* SEÇÃO 1: IDENTIDADE VISUAL */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">1. Identidade Visual</h3>
                            
                           {/* LOGOTIPO */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Logo da Instituição</label>
                                {logoPreview && !data.remove_logo && (
                                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl inline-block w-auto">
                                        <span className="block text-xs text-gray-500 font-semibold mb-2">Logo Atual:</span>
                                        <img src={logoPreview} alt="Logo Atual" className="h-16 w-auto object-contain mb-3" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage('remove_logo')}
                                            className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg transition-all text-xs font-bold border border-red-100 active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Remover Logo
                                        </button>
                                    </div>
                                )}
                               <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp,.svg"
                                    onChange={e => {
                                    const file = e.target.files[0];

                                    if (file) {
                                    // Libera o blob anterior para evitar vazamento de memória
                                    if (logoPreview?.startsWith('blob:')) {
                                        URL.revokeObjectURL(logoPreview);
                                    }

                                    setData('logo_path', file);
                                    setLogoPreview(URL.createObjectURL(file));
                                    setData('remove_logo', false);
                                    }
                                }}
                                    className="w-full border border-gray-300 rounded-xl text-sm p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                                />
                                {errors.logo_path && <p className="text-red-500 text-xs mt-1">{errors.logo_path}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cor Principal (Botões)</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={data.primary_color} onChange={e => setData('primary_color', e.target.value)} className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1 bg-white shrink-0" />
                                        <input type="text" value={data.primary_color} onChange={e => setData('primary_color', e.target.value)} className="border-gray-300 rounded-lg text-sm w-full uppercase font-mono" />
                                    </div>
                                    {errors.primary_color && <p className="text-red-500 text-xs mt-1">{errors.primary_color}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cor de Fundo do Banner</label>
                                    <div className="flex items-center gap-2">
                                        <input type="color" value={data.hero_background_color} onChange={e => setData('hero_background_color', e.target.value)} className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1 bg-white shrink-0" />
                                        <input type="text" value={data.hero_background_color} onChange={e => setData('hero_background_color', e.target.value)} className="border-gray-300 rounded-lg text-sm w-full uppercase font-mono" />
                                    </div>
                                    {errors.hero_background_color && <p className="text-red-500 text-xs mt-1">{errors.hero_background_color}</p>}
                                </div>
                            </div>

                            {/* UPLOAD: IMAGEM DE FUNDO COM MINIATURA E CONFIRMAÇÃO */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem de Fundo do Banner (Opcional)</label>
                                
                                {settings.hero_image_url && !data.remove_hero_image && (
                                    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl inline-block w-full sm:w-auto">
                                        <span className="block text-xs text-gray-500 font-semibold mb-2">Imagem Atual:</span>
                                        <img src={settings.hero_image_url} alt="Banner Atual" className="h-24 w-full sm:w-auto object-cover rounded-lg shadow-sm border border-gray-200 mb-3" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage('remove_hero_image')}
                                            className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg transition-all text-xs font-bold border border-red-100 active:scale-95"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            Remover Imagem
                                        </button>
                                    </div>
                                )}

                                <input 
                                    type="file" accept=".jpg,.jpeg,.png,.webp"
                                    onChange={e => {
                                        setData('hero_image_url', e.target.files[0]);
                                        if (e.target.files[0]) setData('remove_hero_image', false);
                                    }}
                                    className="w-full border border-gray-300 rounded-xl text-sm p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                                />
                                <p className="text-xs text-gray-400 mt-1">Formatos aceitos: JPG, PNG ou WebP (Máx. 2MB). Se preenchido, a cor de fundo será sobreposta.</p>
                                {errors.hero_image_url && <p className="text-red-500 text-xs mt-1">{errors.hero_image_url}</p>}
                            </div>
                        </div>

                        {/* SEÇÃO 2: TEXTOS DA HOME */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-2">2. Textos de Impacto</h3>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Frase de Boas-vindas (Subtítulo Hero)</label>
                                <input type="text" value={data.hero_subtitle} onChange={e => setData('hero_subtitle', e.target.value)} className="w-full border-gray-300 rounded-xl text-sm" placeholder="Ex: Transformando finais tristes em começos felizes." required />
                                {errors.hero_subtitle && <p className="text-red-500 text-xs mt-1">{errors.hero_subtitle}</p>}
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-semibold text-gray-700">Nossa História (Sobre Nós)</label>
                                    <span className={`text-xs ${data.about_text.length >= 2000 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                        {data.about_text.length}/2000
                                    </span>
                                </div>
                                <textarea 
                                    value={data.about_text} 
                                    maxLength="2000"
                                    onChange={e => setData('about_text', e.target.value)} 
                                    className="w-full border-gray-300 rounded-xl text-sm h-32" 
                                    placeholder="Conte como a instituição começou, os maiores desafios e qual o propósito do projeto..." 
                                />
                                {errors.about_text && <p className="text-red-500 text-xs mt-1">{errors.about_text}</p>}
                            </div>
                        </div>

                        {/* SEÇÃO 3: CONTADORES MANUAIS */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">3. Números e Estatísticas</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total de Animais Salvos (Histórico)</label>
                                    <input type="number" min="0" value={data.manual_saved_count} onChange={e => setData('manual_saved_count', parseInt(e.target.value) || 0)} className="w-full border-gray-300 rounded-xl text-sm" />
                                    <p className="text-xs text-gray-400 mt-1">Soma os animais que você já salvou antes de usar o sistema.</p>
                                    {errors.manual_saved_count && <p className="text-red-500 text-xs mt-1">{errors.manual_saved_count}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade de Voluntários atuais</label>
                                    <input type="number" min="0" value={data.manual_volunteers_count} onChange={e => setData('manual_volunteers_count', parseInt(e.target.value) || 0)} className="w-full border-gray-300 rounded-xl text-sm" />
                                    {errors.manual_volunteers_count && <p className="text-red-500 text-xs mt-1">{errors.manual_volunteers_count}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 4: FOTOS (UPLOADS) COM CONFIRMAÇÃO */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">4. Fotos da Instituição</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload da Foto 1 (Sobre Nós)</label>
                                    {settings.about_photo_1 && !data.remove_about_photo_1 && (
                                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl inline-block w-full">
                                            <span className="block text-xs text-gray-500 font-semibold mb-2">Imagem Atual:</span>
                                            <img src={settings.about_photo_1} alt="Foto 1 Atual" className="h-28 w-full object-cover rounded-lg shadow-sm border border-gray-200 mb-3" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage('remove_about_photo_1')}
                                                className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg transition-all text-xs font-bold border border-red-100 active:scale-95"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Remover Imagem
                                            </button>
                                        </div>
                                    )}
                                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={e => { setData('about_photo_1', e.target.files[0]); if (e.target.files[0]) setData('remove_about_photo_1', false); }} className="w-full border border-gray-300 rounded-xl text-sm p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all" />
                                    {errors.about_photo_1 && <p className="text-red-500 text-xs mt-1">{errors.about_photo_1}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Upload da Foto 2 (Sobre Nós)</label>
                                    {settings.about_photo_2 && !data.remove_about_photo_2 && (
                                        <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl inline-block w-full">
                                            <span className="block text-xs text-gray-500 font-semibold mb-2">Imagem Atual:</span>
                                            <img src={settings.about_photo_2} alt="Foto 2 Atual" className="h-28 w-full object-cover rounded-lg shadow-sm border border-gray-200 mb-3" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage('remove_about_photo_2')}
                                                className="flex items-center justify-center gap-2 w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg transition-all text-xs font-bold border border-red-100 active:scale-95"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                Remover Imagem
                                            </button>
                                        </div>
                                    )}
                                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={e => { setData('about_photo_2', e.target.files[0]); if (e.target.files[0]) setData('remove_about_photo_2', false); }} className="w-full border border-gray-300 rounded-xl text-sm p-2 bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all" />
                                    {errors.about_photo_2 && <p className="text-red-500 text-xs mt-1">{errors.about_photo_2}</p>}
                                </div>

                            </div>
                        </div>

                        {/* SEÇÃO 5: PRIVACIDADE DO WHATSAPP E E-MAIL */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">5. Contato Comercial & Privacidade</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp de Atendimento</label>
                                        <input 
                                            type="tel" 
                                            maxLength="15" 
                                            value={data.public_whatsapp} 
                                            onChange={handlePhoneMask} 
                                            className="w-full border-gray-300 rounded-xl text-sm font-mono" 
                                            placeholder="(00) 00000-0000" 
                                        />
                                        {errors.public_whatsapp && <p className="text-red-500 text-xs mt-1">{errors.public_whatsapp}</p>}
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input id="display_whatsapp" type="checkbox" checked={data.display_whatsapp} onChange={e => setData('display_whatsapp', e.target.checked)} className="w-4 h-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500" />
                                        </div>
                                        <label htmlFor="display_whatsapp" className="ml-2 text-xs text-gray-500 leading-tight select-none">
                                            🔒 **Ativar botão de WhatsApp público no site.** <br/>
                                            Se desmarcado, seu número ficará oculto para proteger sua privacidade.
                                        </label>
                                    </div>
                                    {errors.display_whatsapp && <p className="text-red-500 text-xs mt-1">{errors.display_whatsapp}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">E-mail Público (Opcional)</label>
                                    <input type="email" value={data.public_email} onChange={e => setData('public_email', e.target.value)} className="w-full border-gray-300 rounded-xl text-sm" placeholder="contato@instituicao.org" />
                                    <p className="text-xs text-gray-400 mt-1">Este e-mail ficará visível no rodapé do site.</p>
                                    {errors.public_email && <p className="text-red-500 text-xs mt-1">{errors.public_email}</p>}
                                </div>

                            </div>
                        </div>

                        {/* SEÇÃO 6: REDES SOCIAIS */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">6. Redes Sociais</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Link do Facebook</label>
                                    <input type="url" value={data.facebook_url} onChange={e => setData('facebook_url', e.target.value)} className="w-full border-gray-300 rounded-xl text-sm" placeholder="https://facebook.com/suaong" />
                                    {errors.facebook_url && <p className="text-red-500 text-xs mt-1">{errors.facebook_url}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Link do Instagram</label>
                                    <input type="url" value={data.instagram_url} onChange={e => setData('instagram_url', e.target.value)} className="w-full border-gray-300 rounded-xl text-sm" placeholder="https://instagram.com/suaong" />
                                    {errors.instagram_url && <p className="text-red-500 text-xs mt-1">{errors.instagram_url}</p>}
                                </div>
                            </div>
                        </div>

                        {/* ── FEEDBACK E BOTÃO DE SALVAR NO RODAPÉ ── */}
                        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex-1 min-h-[40px] flex items-center">
                                {/* O alerta agora depende do showFlash */}
                                {showFlash && flash?.success && (
                                    <span className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 animate-fade-in">
                                          {flash.success}
                                    </span>
                                )}
                                {hasErrors && (
                                    <span className="inline-flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-lg animate-fade-in">
                                          Existem erros no formulário. Verifique os campos acima.
                                    </span>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                            >
                                {processing ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}