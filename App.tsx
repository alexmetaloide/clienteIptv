
import React, { useState, useEffect } from 'react';
import { Client, Status } from './types';
import { clientService } from './services/clientService';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import ClientForm from './components/ClientForm';
import Statistics from './components/Statistics';
import BottomNav from './components/BottomNav';
import Notification from './components/Notification';

type Page = 'dashboard' | 'clients' | 'statistics';
type ClientSubPage = { page: 'detail', client: Client } | { page: 'form', client?: Client };

interface AppNotification {
  id: string;
  clientId: string;
  message: string;
}

export const App: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [currentClientSubPage, setCurrentClientSubPage] = useState<ClientSubPage | null>(null);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    // Carregar dados do "Banco de Dados" ao iniciar
    useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await clientService.getAll();
                setClients(data);
            } catch (error) {
                console.error("Falha ao carregar clientes", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadClients();
    }, []);

    useEffect(() => {
        if (isLoading || !clients.length) return;

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
        
        const upcomingClients = clients.filter(client => {
            if (client.status !== Status.Ativo) return false;
            const daysUntilDue = getDaysUntilDue(client.dueDate);
            return daysUntilDue <= 1;
        });

        const newNotifications = upcomingClients.map(client => {
            const daysUntilDue = getDaysUntilDue(client.dueDate);
            const message = daysUntilDue === 0 
                ? `O pagamento de ${client.name} vence HOJE.` 
                : `O pagamento de ${client.name} vence AMANHÃ.`;
            return {
                id: `${client.id}-notification`,
                clientId: client.id,
                message,
            };
        });

        setNotifications(newNotifications);

    }, [clients, isLoading]);

    const addClient = async (client: Client) => {
        // Atualização Otimista (Atualiza UI imediatamente)
        setClients(prevClients => [...prevClients, client]);
        // Persistência
        await clientService.create(client);
    };

    const updateClient = async (updatedClient: Client) => {
        // Atualização Otimista
        setClients(prevClients =>
            prevClients.map(c => (c.id === updatedClient.id ? updatedClient : c))
        );
        // Persistência
        await clientService.update(updatedClient);
    };

    const deleteClient = async (clientId: string) => {
        // Atualização Otimista
        setClients(prevClients => prevClients.filter(c => c.id !== clientId));
        // Persistência
        await clientService.delete(clientId);
    };

    const handleUpdateAllClients = async (newClients: Client[]) => {
        setIsLoading(true);
        // Persistência
        await clientService.replaceAll(newClients);
        setClients(newClients);
        setIsLoading(false);
        alert(`${newClients.length} cliente(s) importado(s) com sucesso!`);
    };

    const navigateToClientPage = (subPage: ClientSubPage | null) => {
        setCurrentClientSubPage(subPage);
    };

    const handleBackFromClientSubPage = () => {
        setCurrentClientSubPage(null);
    }

    const dismissNotification = (notificationId: string) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    };

    const handleNotificationClick = (clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setCurrentPage('clients');
            navigateToClientPage({ page: 'detail', client });
            dismissNotification(`${clientId}-notification`);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-screen"><p className="text-xl text-slate-400 animate-pulse">Carregando banco de dados...</p></div>;
        }

        if (currentClientSubPage) {
            if (currentClientSubPage.page === 'detail') {
                return <ClientDetail client={currentClientSubPage.client} onBack={handleBackFromClientSubPage} onEdit={() => navigateToClientPage({ page: 'form', client: currentClientSubPage.client })} onDelete={deleteClient} onUpdateStatus={updateClient} />;
            }
            if (currentClientSubPage.page === 'form') {
                return <ClientForm 
                    client={currentClientSubPage.client} 
                    onSave={(savedClient) => {
                        if(currentClientSubPage.client) {
                            updateClient(savedClient);
                        } else {
                            addClient(savedClient);
                        }
                        handleBackFromClientSubPage();
                    }} 
                    onBack={handleBackFromClientSubPage} 
                />;
            }
        }
        
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard clients={clients} onNavigateToClients={() => setCurrentPage('clients')} />;
            case 'clients':
                return <ClientList clients={clients} onSelectClient={(client) => navigateToClientPage({ page: 'detail', client })} onAddClient={() => navigateToClientPage({ page: 'form' })} onUpdateAllClients={handleUpdateAllClients} />;
            case 'statistics':
                return <Statistics clients={clients} />;
            default:
                return <Dashboard clients={clients} onNavigateToClients={() => setCurrentPage('clients')} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans pb-20">
            <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        message={notification.message}
                        onDismiss={() => dismissNotification(notification.id)}
                        onClick={() => handleNotificationClick(notification.clientId)}
                    />
                ))}
            </div>

            <div className="p-4 sm:p-6">
                {renderContent()}
            </div>
            {!currentClientSubPage && <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />}
        </div>
    );
};

export default App;
