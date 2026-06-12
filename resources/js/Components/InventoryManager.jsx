import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import BaseModal from '@/Components/Modals/BaseModal';
import InputError from '@/Components/InputError';

import foodCatalog from '@/Data/food.json';
import medicationsCatalog from '@/Data/medications.json';
import hygieneCatalog from '@/Data/hygiene.json';
import cleaningCatalog from '@/Data/cleaning.json';

const CATALOGOS = {
    food: foodCatalog,
    medications: medicationsCatalog,
    hygiene: hygieneCatalog,
    cleaning: cleaningCatalog
};

// ── Ícones ─────────────────────────────────────────────────────────────────
const EditIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const TrashIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const TrendingUpIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const TrendingDownIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>;
const ActivityIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const InfoIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
// ── Helper de Status ───────────────────────────────────────────────────────
const StatusBadge = ({ quantity, minQuantity }) => {
    const qty = parseFloat(quantity);
    const min = parseFloat(minQuantity);

    if (qty <= 0) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">Esgotado</span>;
    if (qty <= min) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">Estoque Baixo</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">Em Estoque</span>;
};

// ── COMPONENTE MESTRE ──────────────────────────────────────────────────────
export default function InventoryManager({ title, category, data = [], customFields = [] }) {
    const [itemModal, setItemModal] = useState({ isOpen: false, item: null });
    const [movementsModal, setMovementsModal] = useState({ isOpen: false, item: null });
    const [registerModal, setRegisterModal] = useState({ isOpen: false, item: null });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [globalModalOpen, setGlobalModalOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('all');
    const [detailsModal, setDetailsModal] = useState({ isOpen: false, item: null });

    const itemForm = useForm({
        name: '', unit: '', min_quantity: 0, provider: '', category: category, details: {}
    });

    const movementForm = useForm({
        type: 'in', quantity: '', responsible_name: '', description: ''
    });

    const openItemModal = (item = null) => {
        if (item) {
            itemForm.setData({
                name: item.name, unit: item.unit, min_quantity: item.min_quantity,
                provider: item.provider || '', category: category, details: item.details || {}
            });
        } else {
            itemForm.reset();
            itemForm.setData('category', category);
        }
        setItemModal({ isOpen: true, item });
    };

    const submitItem = (e) => {
        e.preventDefault();
        if (itemModal.item) {
            itemForm.put(route('inventory.update', itemModal.item.id), { onSuccess: () => setItemModal({ isOpen: false, item: null }) });
        } else {
            itemForm.post(route('inventory.store'), { onSuccess: () => setItemModal({ isOpen: false, item: null }) });
        }
    };

    const openRegisterModal = (item) => {
        movementForm.reset();
        setRegisterModal({ isOpen: true, item });
        setMovementsModal({ isOpen: false, item: null });
    };

    const submitMovement = (e) => {
        e.preventDefault();
        movementForm.post(route('inventory.movements.store', registerModal.item.id), {
            onSuccess: () => {
                setRegisterModal({ isOpen: false, item: null });
                router.reload({ only: ['data'] }); 
            }
        });
    };
    
    const sugestoesMercado = CATALOGOS[category] || [];

    // Filtro Combinado: Busca de Texto + Dropdown de Status
    const filteredData = data.filter(item => {
        // 1. Checa a busca por texto
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                            (item.provider && item.provider.toLowerCase().includes(search.toLowerCase()));
        
        // 2. Checa o status do estoque
        let matchStatus = true;
        const qty = parseFloat(item.quantity);
        const min = parseFloat(item.min_quantity);
        
        if (statusFilter === 'esgotado') {
            matchStatus = qty <= 0;
        } else if (statusFilter === 'baixo') {
            matchStatus = qty > 0 && qty <= min;
        } else if (statusFilter === 'ok') {
            matchStatus = qty > min;
        }

        // Só mostra o item se ele passar nos dois filtros
        return matchSearch && matchStatus;
    });

    const allMovements = data.flatMap(item => 
        (item.movements || []).map(mov => ({
            ...mov,
            item_name: item.name,
            unit: item.unit
        }))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const filteredGlobalMovements = allMovements.filter(mov => {
        if (globalFilter === 'all') return true;
        return mov.type === globalFilter;
    });

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    };

    const handleNameChange = (e) => {
        const val = e.target.value;
        itemForm.setData('name', val);

        if (val.length > 0) {
            const normalizedInput = normalizeString(val);
            const filtered = sugestoesMercado.filter(item => 
                normalizeString(item).includes(normalizedInput)
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (nome) => {
        let novosDetalhes = { ...itemForm.data.details };
        let fornecedorAdivinhado = itemForm.data.provider || '';
        let nomeMin = nome.toLowerCase(); 
        let nomeLimpo = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        const marcasComuns = [
            'golden', 'premier', 'pedigree', 'royal canin', 'whiskas', 'granplus', 'magnus', 'special dog', 'joy',
            'bravecto', 'nexgard', 'simparic', 'drontal', 'milbemax', 'zoetis',
            'pipicat', 'pet society', 'chalesco', 'super secao',
            'herbalvet', 'pinho sol', 'ype', 'omo'
        ];

        const marcaAchada = marcasComuns.find(marca => nomeLimpo.includes(marca));

        if (marcaAchada) {
            const dicionarioMarcas = {
                'royal canin': 'Royal Canin',
                'special dog': 'Special Dog',
                'pet society': 'Pet Society',
                'super secao': 'Super Secão',
                'pinho sol': 'Pinho Sol',
                'ype': 'Ypê'
            };
            fornecedorAdivinhado = dicionarioMarcas[marcaAchada] || (marcaAchada.charAt(0).toUpperCase() + marcaAchada.slice(1));
        }

        if (category === 'food') {
            if (nomeMin.includes('cães') || nomeMin.includes('cachorro') || nomeMin.includes('dog')) novosDetalhes.especie = 'Cachorros';
            else if (nomeMin.includes('gato') || nomeMin.includes('feline') || nomeMin.includes('cat')) novosDetalhes.especie = 'Gatos';

            if (nomeMin.includes('filhote') || nomeMin.includes('puppy')) novosDetalhes.fase = 'Filhote';
            else if (nomeMin.includes('adulto') || nomeMin.includes('adult')) novosDetalhes.fase = 'Adulto';
            else if (nomeMin.includes('sênior') || nomeMin.includes('idoso') || nomeMin.includes('senior')) novosDetalhes.fase = 'Sênior';

            if (nomeMin.includes('sem corante') || nomeMin.includes('corante free') || nomeMin.includes('seleção natural')) {
                novosDetalhes.corante = 'Não';
            } else {
                novosDetalhes.corante = 'Sim'; 
            }

            if (nomeMin.includes('hipoalerg') || nomeMin.includes('sensitive') || nomeMin.includes('pele sensivel')) {
                novosDetalhes.hipoalergenica = 'Sim';
            } else {
                novosDetalhes.hipoalergenica = 'Não';
            }

            if (nomeMin.includes('super premium') || nomeMin.includes('royal canin') || nomeMin.includes('premier')) {
                novosDetalhes.qualidade = 'Super Premium';
            } else if (nomeMin.includes('premium especial') || nomeMin.includes('golden') || nomeMin.includes('granplus')) {
                novosDetalhes.qualidade = 'Premium Especial';
            } else if (nomeMin.includes('premium') || nomeMin.includes('magnus') || nomeMin.includes('pedigree')) {
                novosDetalhes.qualidade = 'Premium';
            }

            if (nomeMin.includes('castrado')) {
                novosDetalhes.condicao_especial = 'Castrados';
            } else if (nomeMin.includes('light') || nomeMin.includes('obeso') || nomeMin.includes('controle de peso')) {
                novosDetalhes.condicao_especial = 'Controle de Peso';
            } else {
                novosDetalhes.condicao_especial = 'Nenhuma';
            }
        } 
        else if (category === 'medications') {
            if (nomeMin.includes('antipulga') || nomeMin.includes('bravecto') || nomeMin.includes('nexgard') || nomeMin.includes('simparic')) novosDetalhes.tipo_medicamento = 'Antipulgas/Carrapatos';
            else if (nomeMin.includes('vermífugo') || nomeMin.includes('drontal') || nomeMin.includes('milbemax')) novosDetalhes.tipo_medicamento = 'Vermífugo';
            else if (nomeMin.includes('antibiótico')) novosDetalhes.tipo_medicamento = 'Antibiótico';
            
            if (nomeMin.includes('cães') || nomeMin.includes('cachorro') || nomeMin.includes('dog')) novosDetalhes.especie = 'Cachorros';
            else if (nomeMin.includes('gato') || nomeMin.includes('cat')) novosDetalhes.especie = 'Gatos';
        }

        itemForm.setData(data => ({
            ...data,
            name: nome,
            provider: fornecedorAdivinhado,
            details: novosDetalhes
        }));

        setShowSuggestions(false);
    };

    return (
        <div className="py-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                <p className="text-gray-500 mt-1">Gerencie o estoque de insumos da ONG</p>
            </div>

            {/* Toolbar com Busca e Filtros */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                
                {/* Grupo de Filtros (Busca + Dropdown) */}
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[250px] max-w-2xl">
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Buscar por nome ou fornecedor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-4 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-indigo-500"
                        />
                    </div>
                    
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-4 pr-8 py-2 text-sm border border-gray-200 rounded-lg focus:ring-indigo-500 bg-gray-50 text-gray-700 font-medium cursor-pointer"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="ok">Em Estoque</option>
                        <option value="baixo">Estoque Baixo</option>
                        <option value="esgotado">Esgotado</option>
                    </select>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setGlobalModalOpen(true)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-bold rounded-lg transition-colors shadow-sm flex items-center gap-2">
                        <ActivityIcon /> Histórico Geral
                    </button>
                    <button onClick={() => openItemModal()} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                        + Adicionar insumo
                    </button>
                </div>
            </div>

            {/* Tabela de Insumos */}
            {/* 👇 1. overflow-x-auto no lugar de overflow-hidden para não cortar a tela */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-sm">
                {/* 👇 2. Removido o whitespace-nowrap geral da table */}
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider whitespace-nowrap">
                        <tr>
                            <th className="px-6 py-4">Nome</th>
                            <th className="px-6 py-4">Quantidade</th>
                            <th className="px-6 py-4">Estoque Mínimo</th>
                            <th className="px-6 py-4">Fornecedor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.length === 0 ? (
                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nenhum insumo encontrado.</td></tr>
                        ) : (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    {/* 👇 3. Adicionado min-w e whitespace-normal para o nome quebrar linha bonito */}
                                    <td className="px-6 py-4 font-bold text-gray-900 min-w-[280px] max-w-md whitespace-normal leading-relaxed">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">{item.quantity} {item.unit}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.min_quantity} {item.unit}</td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.provider || '—'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge quantity={item.quantity} minQuantity={item.min_quantity} /></td>
                                    
                                    {/* 👇 4. whitespace-nowrap nos botões para eles nunca se esmagarem */}
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => setMovementsModal({ isOpen: true, item })} 
                                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
                                            >
                                                <ActivityIcon /> Movimentações
                                            </button>
                                            
                                            {Object.keys(item.details || {}).length > 0 && (
                                                <button onClick={() => setDetailsModal({ isOpen: true, item })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver Detalhes Específicos">
                                                    <InfoIcon />
                                                </button>
                                            )}

                                            <button onClick={() => openItemModal(item)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"><EditIcon /></button>
                                            <Link 
                                                href={route('inventory.destroy', item.id)} method="delete" as="button"
                                                onClick={(e) => !confirm(`Excluir ${item.name}?`) && e.preventDefault()}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <TrashIcon />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
           

            {/* ========================================== */}
            {/* MODAL 1: CADASTRAR / EDITAR INSUMO         */}
            {/* ========================================== */}
            <BaseModal isOpen={itemModal.isOpen} onClose={() => setItemModal({ isOpen: false, item: null })} title={itemModal.item ? 'Editar Insumo' : 'Adicionar Insumo'}>
                <form onSubmit={submitItem} className="p-6 space-y-4">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Nome do Insumo</label>
                        <input 
                            type="text" 
                            value={itemForm.data.name} 
                            onChange={handleNameChange}
                            onFocus={() => itemForm.data.name && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="mt-1 block w-full rounded-md border-gray-300 focus:ring-indigo-500 shadow-sm" 
                            placeholder="Ex: Ração Golden..."
                            required 
                            autoComplete="off"
                        />
                        
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto py-1 divide-y divide-gray-100">
                                {filteredSuggestions.map((sugestao, index) => (
                                    <li 
                                        key={index} 
                                        onMouseDown={() => selectSuggestion(sugestao)}
                                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors"
                                    >
                                        {sugestao}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <InputError message={itemForm.errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Unidade de Medida</label>
                            <select 
                                value={itemForm.data.unit} 
                                onChange={e => itemForm.setData('unit', e.target.value)} 
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500" 
                                required
                            >
                                <option value="" disabled>Selecione...</option>
                                <optgroup label="Peso">
                                    <option value="kg">Quilogramas (kg)</option>
                                    <option value="g">Gramas (g)</option>
                                </optgroup>
                                <optgroup label="Volume">
                                    <option value="litros">Litros (L)</option>
                                    <option value="ml">Mililitros (ml)</option>
                                </optgroup>
                                <optgroup label="Outros">
                                    <option value="unidades">Unidades (un)</option>
                                    <option value="caixas">Caixas</option>
                                    <option value="frascos">Frascos</option>
                                    <option value="sacos">Sacos</option>
                                    <option value="pacotes">Pacotes</option>
                                </optgroup>
                            </select>
                            <InputError message={itemForm.errors.unit} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Estoque Mínimo (Alerta)</label>
                            <input type="number" step="0.01" value={itemForm.data.min_quantity} onChange={e => itemForm.setData('min_quantity', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" required />
                            <InputError message={itemForm.errors.min_quantity} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fornecedor / Marca</label>
                        <input type="text" value={itemForm.data.provider} onChange={e => itemForm.setData('provider', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" />
                    </div>

                    {customFields.length > 0 && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Detalhes Específicos</h4>
                            <div className="space-y-3">
                                {customFields.map(field => (
                                    <div key={field.name}>
                                        <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                                        {field.type === 'select' ? (
                                            <select 
                                                value={itemForm.data.details?.[field.name] || ''} 
                                                onChange={e => itemForm.setData('details', { ...(itemForm.data.details || {}), [field.name]: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
                                            >
                                                <option value="">Selecione...</option>
                                                {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        ) : (
                                            <input 
                                                type={field.type} 
                                                value={itemForm.data.details?.[field.name] || ''} 
                                                onChange={e => itemForm.setData('details', { ...(itemForm.data.details || {}), [field.name]: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500" 
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setItemModal({ isOpen: false, item: null })} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
                        <button type="submit" disabled={itemForm.processing} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700">{itemForm.processing ? 'Salvando...' : 'Salvar Insumo'}</button>
                    </div>
                </form>
            </BaseModal>

            {/* ========================================== */}
            {/* MODAL 2: EXTRATO / TIMELINE DO INSUMO      */}
            {/* ========================================== */}
            <BaseModal isOpen={movementsModal.isOpen} onClose={() => setMovementsModal({ isOpen: false, item: null })} title={`Movimentações: ${movementsModal.item?.name}`}>
                <div className="p-6 bg-gray-50/50">
                    <div className="mb-6">
                        <button onClick={() => openRegisterModal(movementsModal.item)} className="px-4 py-2 bg-indigo-500 text-white text-sm font-bold rounded-lg hover:bg-indigo-600 shadow-sm">
                            + Registrar movimentação
                        </button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {movementsModal.item?.movements?.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Nenhuma movimentação registrada ainda.</p>
                        ) : (
                            movementsModal.item?.movements?.map((mov) => {
                                const isEntrada = mov.type === 'in';
                                return (
                                    <div key={mov.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className={`p-2 rounded-lg mt-1 ${isEntrada ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {isEntrada ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900">{movementsModal.item.name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isEntrada ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {isEntrada ? 'Entrada' : 'Saída'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{mov.description || (isEntrada ? 'Ajuste manual (Entrada)' : 'Ajuste manual (Saída)')}</p>
                                            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                                                <span>Quantidade: <strong className="text-gray-900">{mov.quantity} {movementsModal.item.unit}</strong></span>
                                                <span>Responsável: {mov.responsible_name}</span>
                                                <span>Data: {new Date(mov.created_at).toLocaleDateString('pt-BR')} às {new Date(mov.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </BaseModal>

            {/* ========================================== */}
            {/* MODAL 3: REGISTRAR NOVA MOVIMENTAÇÃO       */}
            {/* ========================================== */}
            <BaseModal isOpen={registerModal.isOpen} onClose={() => setRegisterModal({ isOpen: false, item: null })} title="Nova Movimentação">
                <form onSubmit={submitMovement} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Insumo</label>
                            <input type="text" value={registerModal.item?.name || ''} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 text-gray-500" disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo *</label>
                            <select value={movementForm.data.type} onChange={e => movementForm.setData('type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 focus:ring-indigo-500">
                                <option value="in">Entrada</option>
                                <option value="out">Saída</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Quantidade ({registerModal.item?.unit}) *</label>
                            <input type="number" step="0.01" value={movementForm.data.quantity} onChange={e => movementForm.setData('quantity', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" required />
                            <InputError message={movementForm.errors.quantity} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Responsável *</label>
                            <input type="text" placeholder="Nome do responsável" value={movementForm.data.responsible_name} onChange={e => movementForm.setData('responsible_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" required />
                            <InputError message={movementForm.errors.responsible_name} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descrição</label>
                        <textarea placeholder="Descreva o motivo da movimentação" rows={3} value={movementForm.data.description} onChange={e => movementForm.setData('description', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300"></textarea>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setRegisterModal({ isOpen: false, item: null })} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg">Cancelar</button>
                        <button type="submit" disabled={movementForm.processing} className="px-6 py-2 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600">{movementForm.processing ? 'Registrando...' : 'Registrar'}</button>
                    </div>
                </form>
            </BaseModal>

            {/* ========================================== */}
            {/* MODAL 4: HISTÓRICO GERAL DA CATEGORIA      */}
            {/* ========================================== */}
            <BaseModal isOpen={globalModalOpen} onClose={() => setGlobalModalOpen(false)} title={`Histórico Geral: ${title}`}>
                <div className="p-6 bg-gray-50/50">
                    <div className="mb-6 flex gap-2">
                        <button onClick={() => setGlobalFilter('all')} className={`px-4 py-2 text-xs font-bold rounded-lg border ${globalFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>Todas</button>
                        <button onClick={() => setGlobalFilter('in')} className={`px-4 py-2 text-xs font-bold rounded-lg border ${globalFilter === 'in' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-700 border-green-200 hover:bg-green-50'}`}>Só Entradas</button>
                        <button onClick={() => setGlobalFilter('out')} className={`px-4 py-2 text-xs font-bold rounded-lg border ${globalFilter === 'out' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-700 border-red-200 hover:bg-red-50'}`}>Só Saídas</button>
                    </div>

                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {filteredGlobalMovements.length === 0 ? (
                            <p className="text-center text-gray-500 py-4">Nenhuma movimentação encontrada.</p>
                        ) : (
                            filteredGlobalMovements.map((mov) => {
                                const isEntrada = mov.type === 'in';
                                return (
                                    <div key={mov.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                        <div className={`p-2 rounded-lg mt-1 ${isEntrada ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {isEntrada ? <TrendingUpIcon /> : <TrendingDownIcon />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="font-bold text-gray-900">{mov.item_name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isEntrada ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {isEntrada ? 'Entrada' : 'Saída'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{mov.description || 'Ajuste manual de estoque'}</p>
                                            <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
                                                <span>Quantidade: <strong className="text-gray-900">{mov.quantity} {mov.unit}</strong></span>
                                                <span>Resp: {mov.responsible_name}</span>
                                                <span>Data: {new Date(mov.created_at).toLocaleDateString('pt-BR')} às {new Date(mov.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </BaseModal>

            {/* ========================================== */}
            {/* MODAL 5: VER DETALHES ESPECÍFICOS          */}
            {/* ========================================== */}
            <BaseModal isOpen={detailsModal.isOpen} onClose={() => setDetailsModal({ isOpen: false, item: null })} title="Ficha Técnica do Insumo">
                <div className="p-6 bg-white">
                    <div className="mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <InfoIcon />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{detailsModal.item?.name}</h3>
                            <p className="text-sm text-gray-500">Fornecedor: {detailsModal.item?.provider || 'Não informado'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                        {/* A MÁGICA: Varre o JSON e imprime tudo formatado automaticamente! */}
                        {detailsModal.item?.details && Object.entries(detailsModal.item.details).map(([key, value]) => (
                            <div key={key}>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                                    {key.replace(/_/g, ' ')} {/* Tira os underlines do nome do campo */}
                                </span>
                                <span className="block text-sm font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                                    {value || 'Não informado'}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button onClick={() => setDetailsModal({ isOpen: false, item: null })} className="px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
                            Fechar Ficha
                        </button>
                    </div>
                </div>
            </BaseModal>
        </div>  
    );
}