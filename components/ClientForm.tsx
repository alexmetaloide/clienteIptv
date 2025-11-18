import React, { useState } from 'react';
import { Client, Plan, Status } from '../types';
import { BackIcon } from './icons/Icons';

interface ClientFormProps {
    client?: Client;
    onSave: (client: Client) => void;
    onBack: () => void;
}

const planPrices: Record<Plan, number> = {
    [Plan['1_TELA']]: 25,
    [Plan['2_TELAS']]: 35,
    [Plan['1_TELA_YTP']]: 45,
    [Plan['2_TELAS_YTP']]: 55,
};

const ClientForm: React.FC<ClientFormProps> = ({ client, onSave, onBack }) => {
    const [name, setName] = useState(client?.name || '');
    const [contact, setContact] = useState(client?.contact || '');
    const [plan, setPlan] = useState<Plan>(client?.plan || Plan['1_TELA']);
    const [monthlyValue, setMonthlyValue] = useState(client?.monthlyValue ?? planPrices[client?.plan || Plan['1_TELA']]);
    const [dueDate, setDueDate] = useState(client?.dueDate || 1);
    const [status, setStatus] = useState<Status>(client?.status || Status.Ativo);

    const annualValue = monthlyValue * 12;

    const handlePlanChange = (newPlan: Plan) => {
        setPlan(newPlan);
        if (newPlan in planPrices) {
            setMonthlyValue(planPrices[newPlan]);
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
                    <select value={plan} onChange={e => handlePlanChange(e.target.value as Plan)} className="w-full bg-slate-700 text-white p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
                        {Object.values(Plan).map(p => <option key={p} value={p}>{p}</option>)}
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