import React, { useMemo } from 'react';
import { Client, Status } from '../types';
import { UsersIcon, CheckCircleIcon, XCircleIcon, CurrencyDollarIcon, CalendarIcon } from './icons/Icons';

interface DashboardProps {
    clients: Client[];
    onNavigateToClients: () => void;
    onNavigateToPlans: () => void;
}

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
}> = ({ icon, title, value, color }) => (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div className="ml-4">
            <p className="text-slate-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ clients, onNavigateToClients, onNavigateToPlans }) => {
    const stats = useMemo(() => {
        const totalClients = clients.length;
        const activeClients = clients.filter(c => c.status === Status.Ativo).length;
        const inactiveClients = totalClients - activeClients;
        const monthlyRevenue = clients
            .filter(c => c.status === Status.Ativo)
            .reduce((sum, c) => sum + c.monthlyValue, 0);

        return { totalClients, activeClients, inactiveClients, monthlyRevenue };
    }, [clients]);

    const upcomingRenewals = useMemo(() => {
        const today = new Date();
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        const getDaysUntilDue = (dueDate: number) => {
            let diff = dueDate - currentDay;
            if (diff < 0) {
                diff += daysInMonth;
            }
            return diff;
        };

        return clients
            .filter(client => client.status === Status.Ativo)
            .map(client => ({
                ...client,
                daysUntilDue: getDaysUntilDue(client.dueDate),
            }))
            .filter(client => client.daysUntilDue <= 7)
            .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
    }, [clients]);

    const getRenewalText = (days: number) => {
        if (days === 0) return <span className="text-red-400 font-bold">Vence hoje</span>;
        if (days === 1) return <span className="text-orange-400">Vence amanhã</span>;
        return `Vence em ${days} dias`;
    };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">📺 Dashboard Geral</h1>
                <p className="text-slate-400 mt-1">Resumo do seu negócio.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatCard
                    icon={<UsersIcon />}
                    title="Total de Clientes"
                    value={stats.totalClients}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={<CheckCircleIcon />}
                    title="Clientes Ativos"
                    value={stats.activeClients}
                    color="bg-green-500"
                />
                <StatCard
                    icon={<XCircleIcon />}
                    title="Clientes Inativos"
                    value={stats.inactiveClients}
                    color="bg-red-500"
                />
                <StatCard
                    icon={<CurrencyDollarIcon />}
                    title="Receita Mensal"
                    value={stats.monthlyRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    color="bg-orange-500"
                />
            </div>

            <div className="space-y-4 pt-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <CalendarIcon />
                    <span className="ml-2">Próximos Vencimentos</span>
                </h2>
                <div className="bg-slate-800 p-4 rounded-lg shadow-md max-h-72 overflow-y-auto">
                    {upcomingRenewals.length > 0 ? (
                        <ul className="divide-y divide-slate-700">
                            {upcomingRenewals.map(client => (
                                <li key={client.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-white">{client.name}</p>
                                        <p className="text-sm text-slate-400">{client.plan}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-slate-300">Dia {client.dueDate}</p>
                                        <p className="text-sm">{getRenewalText(client.daysUntilDue)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-400">Nenhum vencimento nos próximos 7 dias.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={onNavigateToClients}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Gerenciar Clientes
                </button>
                <button
                    onClick={onNavigateToPlans}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-4 rounded-lg text-lg transition-transform transform hover:scale-105"
                >
                    Gerenciar Planos
                </button>
            </div>
        </div>
    );
};

export default Dashboard;