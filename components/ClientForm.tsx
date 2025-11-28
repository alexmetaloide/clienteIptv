import React, { useState, useEffect } from 'react';
import { Client, Status } from '../types';
import { BackIcon } from './icons/Icons';
import { usePlans } from '../contexts/PlanContext';

interface ClientFormProps {
    client?: Client;
    onSave: (client: Client) => void;
    onBack: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onBack }) => {
    const { plans } = usePlans();
    const [name, setName] = useState(client?.name || '');
    const [contact, setContact] = useState(client?.contact || '');
    const [plan, setPlan] = useState(client?.plan || (plans.length > 0 ? plans[0].name : ''));
    const [monthlyValue, setMonthlyValue] = useState(client?.monthlyValue || (plans.length > 0 ? plans[0].price : 0));
    const [dueDate, setDueDate] = useState(client?.dueDate || 1);
    const [status, setStatus] = useState<Status>(client?.status || Status.Ativo);

    const annualValue = monthlyValue * 12;

    // Update default values when plans load if creating a new client
    useEffect(() => {
        if (!client && plans.length > 0 && !plan) {
            setPlan(plans[0].name);
            setMonthlyValue(plans[0].price);
        }
    }, [plans, client, plan]);

    const handlePlanChange = (selectedPlanName: string) => {
        setPlan(selectedPlanName);
        const selectedPlan = plans.find(p => p.name === selectedPlanName);
        if (selectedPlan) {
            setMonthlyValue(selectedPlan.price);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) {
            alert('O campo Nome é obrigatório.');
            return;
        }

        const clientPayload: Client = {
            id: client?.id || crypto.randomUUID(),
            name,
            contact,
            plan,
            monthlyValue,
            dueDate,
            status,
        };
        onSave(clientPayload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <header className="flex items-center">
                <button type="button" onClick={onBack} className="p-2 rounded-full hover:bg-slate-700">
                    <BackIcon />
                </button>
                <h1 className="text-2xl font-bold text-white ml-4">
                    {client ? 'Editar Cliente' : 'Novo Cliente'}
                </h1>
            </header>

            <div className="bg-slate-800 p-4 sm:p-6 rounded-lg space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nome Completo</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Contato (Telefone/WhatsApp)</label>
                    <input type="text" value={contact} onChange={e => setContact(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Plano</label>
                    <select value={plan} onChange={e => handlePlanChange(e.target.value)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        {plans.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                        {/* If the client has a plan that is no longer in the list, show it as an option to preserve data */}
                        {client && !plans.find(p => p.name === client.plan) && (
                            <option value={client.plan}>{client.plan} (Arquivado)</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Valor Mensal (R$)</label>
                    <input type="number" value={monthlyValue} onChange={e => setMonthlyValue(parseFloat(e.target.value) || 0)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Dia do Vencimento</label>
                    <input type="number" min="1" max="31" value={dueDate} onChange={e => setDueDate(parseInt(e.target.value, 10) || 1)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as Status)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        {Object.values(Status).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="p-4 bg-slate-700/50 rounded-lg text-center">
                    <p className="text-sm text-slate-400">Valor Total Anual</p>
                    <p className="text-2xl font-bold text-orange-400">{annualValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
            </div>

            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg text-lg transition-colors">
                Salvar Cliente
            </button>
        </form>
    );
};

export default ClientForm;