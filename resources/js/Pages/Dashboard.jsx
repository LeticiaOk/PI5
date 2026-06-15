import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ auth }) {

    const { slug } = usePage().props; 
    // se o backend já estiver enviando slug atual da ONG

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard | Foursters" />

            <div className="p-8 space-y-6">

                {/* HEADER */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6">
                    <h1 className="text-2xl font-black text-slate-900">
                        Bem-vindo, {auth.user.name} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        Aqui você gerencia sua ONG dentro da Foursters.
                    </p>
                </div>

                {/* CARDS COM ROTAS REAIS */}
                <div className="grid md:grid-cols-3 gap-6">

                    <Link
                        href="/animals"
                        className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition"
                    >
                        <h2 className="text-sm font-bold text-slate-500">Gestão</h2>
                        <p className="text-lg font-bold text-slate-900 mt-2">
                            Animais
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Cadastre e gerencie os animais da sua ONG.
                        </p>
                    </Link>

                    <Link
                        href={`/${slug ?? 'caofeliz'}`}
                        className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition"
                    >
                        <h2 className="text-sm font-bold text-slate-500">Vitrine pública</h2>
                        <p className="text-lg font-bold text-slate-900 mt-2">
                            Página da ONG
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Veja como o público enxerga sua ONG.
                        </p>
                    </Link>

                    <Link
                        href="/painel/configuracoes"
                        className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition"
                    >
                        <h2 className="text-sm font-bold text-slate-500">Sistema</h2>
                        <p className="text-lg font-bold text-slate-900 mt-2">
                            Configurações
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Ajuste dados da ONG e preferências do sistema.
                        </p>
                    </Link>

                </div>

                {/* FOOTER BANNER */}
                <div className="bg-indigo-600 text-white rounded-2xl p-6">
                    <h2 className="text-lg font-bold">
                        Tudo conectado automaticamente 
                    </h2>
                    <p className="text-sm text-indigo-100 mt-2">
                        Alterações feitas aqui já refletem na sua vitrine pública em tempo real.
                    </p>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}