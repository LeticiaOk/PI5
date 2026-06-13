import { useState, useMemo } from 'react';

// ── Ícones Genéricos ────────────────────────────────────────────────────────
const SearchIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
);
const SortIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" /></svg>
);
const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" d="M12 4v16m8-8H4" /></svg>
);

export default function DataBrowser({ 
    title,
    subtitle, 
    data = [], 
    columns = [], 
    renderMobileCard, 
    onAddClick, 
    addLabel = "Adicionar",
    searchPlaceholder = "Buscar...",
    searchFn, 
    sortFn    
}) {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');

    const filteredAndSorted = useMemo(() => {
        let list = [...data];
        
        if (search.trim()) {
            list = list.filter(item => 
                searchFn ? searchFn(item, search.toLowerCase()) : 
                Object.values(item).some(val => 
                    String(val).toLowerCase().includes(search.toLowerCase())
                )
            );
        }

        list.sort((a, b) => {
            if (sortFn) return sortFn(a, b, sort);
            return sort === 'newest' ? (b.id - a.id) : (a.id - b.id);
        });

        return list;
    }, [data, search, sort, searchFn, sortFn]);

    const toggleSort = () => setSort(s => (s === 'newest' ? 'oldest' : 'newest'));

    return (
        <div className="py-6 sm:py-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-sm sm:text-base text-gray-500 mt-1">{subtitle}</p>}
            </div>

            <div className="mb-6 bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-3/5 lg:w-1/2">
                    <div className="relative flex-1 shrink-0">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                            <SearchIcon />
                        </span>
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    <button
                        onClick={toggleSort}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-gray-700 shrink-0"
                    >
                        <SortIcon />
                        {sort === 'newest' ? 'Mais novos' : 'Mais antigos'}
                    </button>
                </div>

                {onAddClick && addLabel && (
                    <div className="w-full md:w-auto pt-3 md:pt-0 border-t border-gray-100 md:border-t-0 shrink-0">
                        <button
                            onClick={onAddClick}
                            className="flex items-center justify-center w-full md:w-auto gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                        >
                            <PlusIcon />
                            {addLabel}
                        </button>
                    </div>
                )}
            </div>

            <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/80">
                                {columns.map((col, index) => (
                                    <th 
                                        key={index} 
                                        className={`px-6 py-4 text-[11px] font-bold tracking-wider text-gray-500 uppercase whitespace-nowrap ${col.key === 'actions' ? 'text-center' : 'text-left'}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAndSorted.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                                        Nenhum registro encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredAndSorted.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                                        {columns.map((col, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                                <div className={col.key === 'actions' ? 'flex justify-center items-center gap-2' : ''}>
                                                    {col.render ? col.render(item[col.key], item) : item[col.key]}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="block md:hidden space-y-4 mt-4">
                {filteredAndSorted.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
                        Nenhum registro encontrado.
                    </div>
                ) : (
                    filteredAndSorted.map(item => renderMobileCard(item))
                )}
            </div>

            {filteredAndSorted.length > 0 && (
                <div className="mt-4 flex justify-end">
                    <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        Total: {filteredAndSorted.length} {filteredAndSorted.length === 1 ? 'registro' : 'registros'}
                    </span>
                </div>
            )}
        </div>
    );
}