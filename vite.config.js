import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

// Detecta se o ambiente atual é o GitHub Codespaces
const isCodespaces = process.env.CODESPACE_NAME !== undefined;

export default defineConfig({
    server: isCodespaces ? {
        // Configuração restrita e segura para o ambiente de nuvem do Codespaces
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
            host: `${process.env.CODESPACE_NAME}-5173.app.github.dev`,
            clientPort: 443,
            protocol: 'wss',
        }
    } : {
        // Configuração padrão, limpa e otimizada para o seu Localhost
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
        }
    },
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});

//antigo
// localhost

// import { defineConfig } from 'vite';
// import laravel from 'laravel-vite-plugin';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: 'resources/js/app.jsx',
//             refresh: true,
//         }),
//         react(),
//     ],
//     resolve: {
//         alias: {
//             // Permite importar componentes usando '@/Components/...'
//             '@': path.resolve(__dirname, './resources/js'),
//         },
//     },
//     // Removido o server host 0.0.0.0 para evitar conflitos de handshake do Vite
//     // Se estiver usando Docker, adicione novamente apenas se necessário.
// });