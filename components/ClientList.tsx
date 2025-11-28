import React, { useState, useMemo, useRef } from 'react';
import { Client, Status } from '../types';
import { PlusIcon, DownloadIcon, UploadIcon, BackIcon } from './icons/Icons';
import { usePlans } from '../contexts/PlanContext';

interface ClientListProps {
    clients: Client[];
    onSelectClient: (client: Client) => void;
    onAddClient: () => void;
    onUpdateAllClients: (clients: Client[]) => void;
    onBack: () => void;
}

const validateClients = (data: any, planNames: string[]): { validClients: Client[], errors: string[] } => {
    if (!Array.isArray(data)) {
        return { validClients: [], errors: ["O arquivo não contém uma lista (array) de clientes."] };
    }

    const validClients: Client[] = [];
    const errors: string[] = [];
    const statusValues = Object.values(Status);

    data.forEach((item: any, index: number) => {
        const clientErrors: string[] = [];
        if (typeof item !== 'object' || item === null) {
            errors.push(`A entrada na linha ${index + 1} não é um objeto de cliente válido.`);
            return;
        }

        if (typeof item.id !== 'string' || !item.id) clientErrors.push('ID ausente ou inválido');
        if (typeof item.name !== 'string' || !item.name) clientErrors.push('Nome ausente ou inválido');
        if (typeof item.monthlyValue !== 'number') clientErrors.push('Valor Mensal ausente ou com formato inválido');
        if (typeof item.dueDate !== 'number' || item.dueDate < 1 || item.dueDate > 31) clientErrors.push('Dia do Vencimento precisa ser um número entre 1 e 31');

        // Allow plans that are not in the current list (legacy/archived plans), but warn if it looks completely wrong? 
        // For now, we just check if it's a string.
        if (typeof item.plan !== 'string' || !item.plan) clientErrors.push(`Plano inválido`);

        if (!statusValues.includes(item.status)) clientErrors.push(`Status '${item.status || 'indefinido'}' é inválido`);

        if (clientErrors.length > 0) {
            errors.push(`Cliente #${index + 1} (${item.name || 'Nome desconhecido'}) possui erros: ${clientErrors.join(', ')}.`);
        } else {
            validClients.push({
                id: item.id,
                name: item.name,
                contact: typeof item.contact === 'string' ? item.contact : '',
                plan: item.plan,
                monthlyValue: item.monthlyValue,
                dueDate: item.dueDate,
                status: item.status
            });
        }
    });

    return { validClients, errors };
};


const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onAddClient, onUpdateAllClients, onBack }) => {
    const { plans } = usePlans();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
    const [planFilter, setPlanFilter] = useState<'all' | string>('all');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const filteredClients = useMemo(() => {
        return clients.filter(client => {
            const nameMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'all' || client.status === statusFilter;
            const planMatch = planFilter === 'all' || client.plan === planFilter;
            return nameMatch && statusMatch && planMatch;
        });
    }, [clients, searchTerm, statusFilter, planFilter]);

    const handleExport = () => {
        if (clients.length === 0) {
            alert("Não há clientes para exportar.");
            return;
        }
        const blob = new Blob([JSON.stringify(clients, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'clientes_iptv_backup.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Não foi possível ler o conteúdo do arquivo.");

                let importedData;
                try {
                    importedData = JSON.parse(text);
                } catch (parseError) {
                    alert("Erro de sintaxe no arquivo JSON. Verifique se o arquivo está formatado corretamente. Dica: use um validador de JSON online para encontrar o problema.");
                    return;
                }

                const planNames = plans.map(p => p.name);
                const { validClients, errors } = validateClients(importedData, planNames);

                if (errors.length > 0) {
                    const errorMessage = `Encontramos alguns problemas no arquivo:\n\n- ${errors.slice(0, 5).join('\n- ')}${errors.length > 5 ? `\n- ...e mais ${errors.length - 5} erro(s).` : ''}\n\nVocê deseja importar os ${validClients.length} clientes que parecem estar corretos?`;
                    if (!window.confirm(errorMessage)) {
                        return;
                    }
                }

                if (validClients.length === 0) {
                    alert("Nenhum cliente válido foi encontrado no arquivo para importar.");
                    return;
                }

                if (window.confirm(`Isso irá substituir TODOS os seus dados atuais por ${validClients.length} cliente(s) do arquivo. Tem certeza que deseja continuar?`)) {
                    onUpdateAllClients(validClients);
                }
            } catch (error) {
                alert(`Ocorreu um erro inesperado ao processar o arquivo: ${error instanceof Error ? error.message : String(error)}`);
            } finally {
                if (event.target) {
                    event.target.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const StatusBadge: React.FC<{ status: Status }> = ({ status }) => (
        <span className={`flex items-center text-sm font-medium ${status === Status.Ativo ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`h-2 w-2 rounded-full mr-2 ${status === Status.Ativo ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {status}
        </span>
    );

    return (
        <div className="space-y-4">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                    <button type="button" onClick={onBack} className="p-2 rounded-full hover:bg-slate-700 mr-2 sm:hidden">
                        <BackIcon />
                    </button>
                    <div>
                        <div className="flex items-center">
                            <button type="button" onClick={onBack} className="p-2 rounded-full hover:bg-slate-700 mr-2 hidden sm:block">
                                <BackIcon />
                            </button>
                            <h1 className="text-3xl font-bold text-white">Clientes</h1>
                        </div>
                        <p className="text-slate-400 mt-1 ml-0 sm:ml-12">Gerencie sua base de assinantes.</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleExport}
                            className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <DownloadIcon />
                            <span className="ml-2">Exportar JSON</span>
                        </button>
                        <button
                            onClick={handleImportClick}
                            className="flex items-center justify-center bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <UploadIcon />
                            <span className="ml-2">Importar JSON</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".json" className="hidden" />
                        <button
                            onClick={onAddClient}
                            className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                        >
                            <PlusIcon />
                            <span className="ml-2">Novo Cliente</span>
                        </button>
                    </div>
                    <p className="text-xs text-slate-500 text-center sm:text-right pt-1">
                        Dica: Exporte e salve no Google Drive para ter um backup na nuvem.
                    </p>
                </div>
            </header>

            <div className="p-4 bg-slate-800 rounded-lg space-y-4">
                <input
                    type="text"
                    placeholder="🔎 Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => setStatusFilter('all')} className={`px-4 py-2 text-sm rounded-full ${statusFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Todos</button>
                    <button onClick={() => setStatusFilter(Status.Ativo)} className={`px-4 py-2 text-sm rounded-full ${statusFilter === Status.Ativo ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Ativos</button>
                    <button onClick={() => setStatusFilter(Status.Inativo)} className={`px-4 py-2 text-sm rounded-full ${statusFilter === Status.Inativo ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-300'}`}>Inativos</button>
                </div>
                <div className="border-t border-slate-700 pt-4">
                    <h3 className="text-sm font-medium text-slate-400 mb-2">Filtrar por Plano:</h3>
                    <div className="flex gap-2 flex-wrap">
                        <button onClick={() => setPlanFilter('all')} className={`px-3 py-1.5 text-xs rounded-full ${planFilter === 'all' ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                            Todos os Planos
                        </button>
                        {plans.map(plan => (
                            <button
                                key={plan.id}
                                onClick={() => setPlanFilter(plan.name)}
                                className={`px-3 py-1.5 text-xs rounded-full ${planFilter === plan.name ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300'}`}
                            >
                                {plan.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                        <div key={client.id} onClick={() => onSelectClient(client)} className="bg-slate-800 p-4 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-lg text-white">{client.name}</p>
                                <StatusBadge status={client.status} />
                            </div>
                            <div className="flex justify-between items-center text-slate-400 mt-2 text-sm">
                                <span>{client.plan}</span>
                                <span className="font-semibold text-orange-400">{client.monthlyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-400">Nenhum cliente encontrado para os filtros selecionados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientList;