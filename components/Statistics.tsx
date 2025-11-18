import React, { useMemo } from 'react';
import { Client, Plan, Status } from '../types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatisticsProps {
    clients: Client[];
}

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="h-64">
            {children}
        </div>
    </div>
);

const Statistics: React.FC<StatisticsProps> = ({ clients }) => {
    const statsData = useMemo(() => {
        const activeClients = clients.filter(c => c.status === Status.Ativo);
        const inactiveClients = clients.filter(c => c.status === Status.Inativo);

        const clientStatusData = [
            { name: 'Ativos', value: activeClients.length },
            { name: 'Inativos', value: inactiveClients.length },
        ];
        
        const monthlyRevenue = activeClients.reduce((sum, c) => sum + c.monthlyValue, 0);
        const annualRevenue = monthlyRevenue * 12;

        const revenueData = [
            { name: 'Receita', Mensal: monthlyRevenue, Anual: annualRevenue },
        ];
        
        const planCounts = clients.reduce((acc, client) => {
            acc[client.plan] = (acc[client.plan] || 0) + 1;
            return acc;
        }, {} as Record<Plan, number>);
        
        const mostSoldPlans = Object.keys(planCounts)
            .map((plan) => ({ plan, count: planCounts[plan as Plan] }))
            .sort((a, b) => b.count - a.count);

        return { clientStatusData, revenueData, mostSoldPlans };
    }, [clients]);

    const COLORS = ['#10B981', '#EF4444']; // Green-500, Red-500

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-white">Estatísticas</h1>
                <p className="text-slate-400 mt-1">Análise de desempenho do seu negócio.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartContainer title="Clientes Ativos vs. Inativos">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={statsData.clientStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                {statsData.clientStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: number) => `${value} clientes`} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title="Receita Mensal vs. Anual">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statsData.revenueData} layout="vertical">
                            <XAxis type="number" stroke="#94A3B8" tickFormatter={(value) => `R$${Number(value)/1000}k`} />
                            <YAxis type="category" dataKey="name" stroke="#94A3B8" />
                            <Tooltip formatter={(value) => (value as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                            <Legend />
                            <Bar dataKey="Mensal" fill="#F97316" />
                            <Bar dataKey="Anual" fill="#3B82F6" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                <ChartContainer title="Planos Mais Vendidos">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statsData.mostSoldPlans} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                             <XAxis type="number" stroke="#94A3B8" allowDecimals={false} />
                             <YAxis type="category" dataKey="plan" stroke="#94A3B8" />
                             <Tooltip formatter={(value: number) => `${value} assinantes`} />
                             <Legend />
                             <Bar dataKey="count" fill="#6366F1" name="Assinantes" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </div>
        </div>
    );
};

export default Statistics;