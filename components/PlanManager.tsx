import React, { useState } from 'react';
import { usePlans } from '../contexts/PlanContext';
import { Plan } from '../types';
import { BackIcon, PlusIcon, TrashIcon, EditIcon } from './icons/Icons';

interface PlanManagerProps {
    onBack: () => void;
}

const PlanManager: React.FC<PlanManagerProps> = ({ onBack }) => {
    const { plans, addPlan, updatePlan, deletePlan } = usePlans();
    const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;

        const priceValue = parseFloat(price);
        if (isNaN(priceValue)) {
            alert('O preço deve ser um número válido.');
            return;
        }

        if (editingPlan) {
            updatePlan({ ...editingPlan, name, price: priceValue });
            setEditingPlan(null);
        } else {
            addPlan({ name, price: priceValue });
        }
        setName('');
        setPrice('');
    };

    const handleEdit = (plan: Plan) => {
        setEditingPlan(plan);
        setName(plan.name);
        setPrice(plan.price.toString());
    };

    const handleCancelEdit = () => {
        setEditingPlan(null);
        setName('');
        setPrice('');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este plano? Clientes que usam este plano não serão afetados, mas o plano não aparecerá mais para novos cadastros.')) {
            deletePlan(id);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex items-center">
                <button type="button" onClick={onBack} className="p-2 rounded-full hover:bg-slate-700">
                    <BackIcon />
                </button>
                <h1 className="text-2xl font-bold text-white ml-4">Gerenciar Planos</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div className="bg-slate-800 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-bold text-white mb-4">
                        {editingPlan ? 'Editar Plano' : 'Novo Plano'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Plano</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ex: 1 Tela + Canais"
                                required
                                className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Preço Mensal (R$)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={e => setPrice(e.target.value)}
                                placeholder="0.00"
                                step="0.01"
                                required
                                className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                            >
                                {editingPlan ? <><EditIcon /> <span className="ml-2">Atualizar</span></> : <><PlusIcon /> <span className="ml-2">Adicionar</span></>}
                            </button>
                            {editingPlan && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white">Planos Cadastrados</h2>
                    <div className="space-y-3">
                        {plans.length === 0 ? (
                            <p className="text-slate-400">Nenhum plano cadastrado.</p>
                        ) : (
                            plans.map(plan => (
                                <div key={plan.id} className="bg-slate-800 p-4 rounded-lg flex justify-between items-center group">
                                    <div>
                                        <p className="font-bold text-white">{plan.name}</p>
                                        <p className="text-orange-400 font-medium">
                                            {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(plan)}
                                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(plan.id)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                                            title="Excluir"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanManager;
