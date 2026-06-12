import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 font-sans px-4">
            <Head title="Entrar | PlataformaX" />

            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 mb-10">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">X</span>
                </div>
                <span className="text-2xl font-black text-slate-900">PlataformaX</span>
            </Link>

            {status && (
                <div className="mb-4 w-full max-w-md text-sm font-medium text-emerald-600 text-center">
                    {status}
                </div>
            )}

            {/* CARD */}
            <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-200/50 p-8">
                <h1 className="text-xl font-black text-slate-900 mb-1">Entrar no painel</h1>
                <p className="text-sm text-slate-500 mb-8">Acesse a gestão da sua ONG.</p>

                <form onSubmit={submit} className="space-y-5">
                    {/* EMAIL */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="voce@suaong.com.br"
                        />
                        {errors.email && (
                            <p className="mt-2 text-sm font-medium text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-2 text-sm font-medium text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* REMEMBER + FORGOT */}
                    <div className="flex items-center justify-between pt-1">
                        <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer">
                            <input
                                id="remember"
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-slate-600">Lembrar de mim</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                Esqueceu sua senha?
                            </Link>
                        )}
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Entrar
                    </button>
                </form>
            </div>

            <p className="mt-8 text-sm text-slate-400">
                Ainda não tem acesso?{' '}
                <Link href="/#contato" className="font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                    Solicite um convite
                </Link>
            </p>
        </div>
    );
}