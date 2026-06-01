import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Mapeia todas as páginas do sistema
        const pages = import.meta.glob('./Pages/**/*.{jsx,tsx}');
        
        // Busca a rota correspondente, aceitando tanto .tsx quanto .jsx
        const path = Object.keys(pages).find(
            (key) => key === `./Pages/${name}.tsx` || key === `./Pages/${name}.jsx`
        );
        
        // Dispara erro de fallback caso a página não exista
        if (!path) {
            throw new Error(`Page not found: ./Pages/${name}`);
        }
        
        // Retorna o componente React correto
        return typeof pages[path] === 'function' ? pages[path]() : pages[path];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});