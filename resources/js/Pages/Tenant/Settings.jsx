import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Settings({ auth, settings }) {
    const { flash } = usePage().props;

    // Inicializa o formulário com o useForm trazendo os dados atuais do banco
    const { data, setData, put, processing, errors } = useForm({
        primary_color: settings.primary_color || '#4f46e5',
        hero_subtitle: settings.hero_subtitle || '',
        about_text: settings.about_text || '',
        public_whatsapp: settings.public_whatsapp || '',
        display_whatsapp: !!settings.display_whatsapp, // Converte 1/0 para true/false
        manual_saved_count: settings.manual_saved_count || 0,
        manual_volunteers_count: settings.manual_volunteers_count || 0,
        about_photo_1: settings.about_photo_1 || '',
        about_photo_2: settings.about_photo_2 || '',
        hero_image_url: settings.hero_image_url || '',
        hero_background_color: settings.hero_background_color || '#0f172a',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('tenant.settings.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Configurações da Vitrine Pública</h2>}
        >
            <Head title="Configurações do Site" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-emerald-100 text-emerald-800 font-medium rounded-xl border border-emerald-200 text-sm">
                            ✨ {flash.success}
                        </div>
                    )}

                    <form onSubmit={submit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                        
                       {/* SEÇÃO 1: IDENTIDADE VISUAL */}
<div>
    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">1. Identidade Visual</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Cor Principal */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cor Principal (Botões)</label>
            <div className="flex items-center gap-2">
                <input 
                    type="color" 
                    value={data.primary_color}
                    onChange={e => setData('primary_color', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1 bg-white shrink-0"
                />
                <input 
                    type="text" 
                    value={data.primary_color}
                    onChange={e => setData('primary_color', e.target.value)}
                    className="border-gray-300 rounded-lg text-sm w-full uppercase font-mono"
                />
            </div>
        </div>

        {/* Cor de Fundo do Banner */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cor de Fundo do Banner</label>
            <div className="flex items-center gap-2">
                <input 
                    type="color" 
                    value={data.hero_background_color}
                    onChange={e => setData('hero_background_color', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer p-1 bg-white shrink-0"
                />
                <input 
                    type="text" 
                    value={data.hero_background_color}
                    onChange={e => setData('hero_background_color', e.target.value)}
                    className="border-gray-300 rounded-lg text-sm w-full uppercase font-mono"
                />
            </div>
        </div>
    </div>

    {/* Imagem de Fundo */}
    <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Imagem de Fundo do Banner (Opcional)</label>
        <input 
            type="text"
            value={data.hero_image_url}
            onChange={e => setData('hero_image_url', e.target.value)}
            className="w-full border-gray-300 rounded-xl text-sm"
            placeholder="https://linkdaimagem.com/foto.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">Se preenchido, a cor de fundo será sobreposta por esta imagem.</p>
        {errors.hero_image_url && <p className="text-red-500 text-xs mt-1">{errors.hero_image_url}</p>}
    </div>
</div>

                        {/* SEÇÃO 2: TEXTOS DA HOME */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-2">2. Textos de Impacto</h3>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Frase de Boas-vindas (Subtítulo Hero)</label>
                                <input 
                                    type="text"
                                    value={data.hero_subtitle}
                                    onChange={e => setData('hero_subtitle', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm"
                                    placeholder="Ex: Transformando finais tristes em começos felizes."
                                    required
                                />
                                {errors.hero_subtitle && <p className="text-red-500 text-xs mt-1">{errors.hero_subtitle}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nossa História (Sobre Nós)</label>
                                <textarea 
                                    value={data.about_text}
                                    onChange={e => setData('about_text', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl text-sm h-32"
                                    placeholder="Conte como a ONG começou, os maiores desafios e qual o propósito do projeto..."
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
                                    <input 
                                        type="number"
                                        value={data.manual_saved_count}
                                        onChange={e => setData('manual_saved_count', parseInt(e.target.value) || 0)}
                                        className="w-full border-gray-300 rounded-xl text-sm"
                                        min="0"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Soma os animais que você já salvou antes de usar o sistema.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade de Voluntários atuais</label>
                                    <input 
                                        type="number"
                                        value={data.manual_volunteers_count}
                                        onChange={e => setData('manual_volunteers_count', parseInt(e.target.value) || 0)}
                                        className="w-full border-gray-300 rounded-xl text-sm"
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 4: FOTOS */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">4. Fotos da Instituição</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL da Foto 1 (Sobre Nós)</label>
                                    <input 
                                        type="text"
                                        value={data.about_photo_1}
                                        onChange={e => setData('about_photo_1', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl text-sm"
                                        placeholder="https://linkdaimagem.com/foto1.jpg"
                                    />
                                    {errors.about_photo_1 && <p className="text-red-500 text-xs mt-1">{errors.about_photo_1}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL da Foto 2 (Sobre Nós)</label>
                                    <input 
                                        type="text"
                                        value={data.about_photo_2}
                                        onChange={e => setData('about_photo_2', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl text-sm"
                                        placeholder="https://linkdaimagem.com/foto2.jpg"
                                    />
                                    {errors.about_photo_2 && <p className="text-red-500 text-xs mt-1">{errors.about_photo_2}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO 5: PRIVACIDADE DO WHATSAPP */}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">5. Contato Comercial & Privacidade</h3>
                            <div className="space-y-4">
                                <div className="max-w-xs">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp de Atendimento</label>
                                    <input 
                                        type="text"
                                        value={data.public_whatsapp}
                                        onChange={e => setData('public_whatsapp', e.target.value)}
                                        className="w-full border-gray-300 rounded-xl text-sm"
                                        placeholder="Ex: 11999998888"
                                    />
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="display_whatsapp"
                                            type="checkbox"
                                            checked={data.display_whatsapp}
                                            onChange={e => setData('display_whatsapp', e.target.checked)}
                                            className="w-4 h-4 border border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <label htmlFor="display_whatsapp" className="ml-2 text-xs text-gray-500 leading-tight select-none">
                                        🔒 **Ativar botão de WhatsApp público no site.** <br/>
                                        Se desmarcado, seu número ficará oculto para proteger sua privacidade contra spans/trotes.
                                    </label>
                                </div>
                            </div>
                        </div>

                                        {/* SEÇÃO 6: REDES SOCIAIS */}
<div>
    <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">6. Redes Sociais</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link do Facebook</label>
            <input 
                type="url"
                value={data.facebook_url}
                onChange={e => setData('facebook_url', e.target.value)}
                className="w-full border-gray-300 rounded-xl text-sm"
                placeholder="https://facebook.com/suaong"
            />
        </div>
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Link do Instagram</label>
            <input 
                type="url"
                value={data.instagram_url}
                onChange={e => setData('instagram_url', e.target.value)}
                className="w-full border-gray-300 rounded-xl text-sm"
                placeholder="https://instagram.com/suaong"
            />
        </div>
    </div>
</div>

                        {/* BOTÃO DE SALVAR */}
                        <div className="pt-4 border-t flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Atualizando Visual...' : 'Salvar Alterações 🎨'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}