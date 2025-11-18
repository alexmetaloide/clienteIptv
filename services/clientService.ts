
import { Client, Plan, Status } from '../types';

const STORAGE_KEY = 'iptv_clients_db_v1';

// Dados iniciais para popular o banco de dados na primeira execução
const getInitialClients = (): Client[] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayToday = today.getDate();
    const dayTomorrow = tomorrow.getDate();
    
    return [
        { id: '1', name: 'João Silva', contact: '5511987654321', plan: Plan['2_TELAS'], monthlyValue: 35, dueDate: 10, status: Status.Ativo },
        { id: '2', name: 'Maria Oliveira', contact: '5521912345678', plan: Plan['1_TELA'], monthlyValue: 25, dueDate: 15, status: Status.Ativo },
        { id: '3', name: 'Pedro Souza', contact: '', plan: Plan['1_TELA_YTP'], monthlyValue: 45, dueDate: 20, status: Status.Inativo },
        { id: '4', name: 'Ana Costa', contact: '5541933332222', plan: Plan['2_TELAS_YTP'], monthlyValue: 55, dueDate: dayTomorrow, status: Status.Ativo },
        { id: '5', name: 'Carlos Pereira', contact: '5585999998888', plan: Plan['1_TELA'], monthlyValue: 25, dueDate: dayToday, status: Status.Ativo },
    ];
};

// Simula delay de rede para parecer um banco de dados real
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const clientService = {
    getAll: async (): Promise<Client[]> => {
        await simulateDelay();
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (!storedData) {
            const initialData = getInitialClients();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
        }

        try {
            return JSON.parse(storedData);
        } catch (error) {
            console.error("Erro ao ler banco de dados local", error);
            return [];
        }
    },

    create: async (client: Client): Promise<void> => {
        await simulateDelay(100);
        const storedData = localStorage.getItem(STORAGE_KEY);
        const clients: Client[] = storedData ? JSON.parse(storedData) : [];
        clients.push(client);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    },

    update: async (updatedClient: Client): Promise<void> => {
        await simulateDelay(100);
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) return;

        const clients: Client[] = JSON.parse(storedData);
        const index = clients.findIndex(c => c.id === updatedClient.id);
        
        if (index !== -1) {
            clients[index] = updatedClient;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
        }
    },

    delete: async (clientId: string): Promise<void> => {
        await simulateDelay(100);
        const storedData = localStorage.getItem(STORAGE_KEY);
        if (!storedData) return;

        let clients: Client[] = JSON.parse(storedData);
        clients = clients.filter(c => c.id !== clientId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
    },

    replaceAll: async (newClients: Client[]): Promise<void> => {
        await simulateDelay(500);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
    }
};
