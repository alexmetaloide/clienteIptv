
import React, { useState, useEffect } from 'react';
import { Client, Status } from './types';
import { firebaseClientService } from './services/firebaseService';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientDetail from './components/ClientDetail';
import ClientForm from './components/ClientForm';
import Statistics from './components/Statistics';
import BottomNav from './components/BottomNav';

import PlanManager from './components/PlanManager';

type Page = 'dashboard' | 'clients' | 'statistics' | 'plans';
type ClientSubPage = { page: 'detail', client: Client } | { page: 'form', client?: Client };



import { PlanProvider } from './contexts/PlanContext';

export const App: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');
    const [currentClientSubPage, setCurrentClientSubPage] = useState<ClientSubPage | null>(null);


    // Carregar dados do "Banco de Dados" ao iniciar
    useEffect(() => {
        const loadClients = async () => {
            try {
                const data = await firebaseClientService.getAll();
                setClients(data);
            } catch (error) {
                console.error("Falha ao carregar clientes", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadClients();
    }, []);



    const addClient = async (client: Client) => {
        // Atualização Otimista (Atualiza UI imediatamente)
        setClients(prevClients => [...prevClients, client]);
        // Persistência - Firebase retorna o ID
        const newId = await firebaseClientService.create(client);
        // Atualiza o cliente com o ID retornado
        setClients(prevClients =>
            prevClients.map(c => c.id === client.id ? { ...client, id: newId } : c)
        );
    };

    const updateClient = async (updatedClient: Client) => {
        // Atualização Otimista
        setClients(prevClients =>
            prevClients.map(c => (c.id === updatedClient.id ? updatedClient : c))
        );
        // Persistência
        await firebaseClientService.update(updatedClient.id, updatedClient);
    };

    const deleteClient = async (clientId: string) => {
        // Atualização Otimista
        setClients(prevClients => prevClients.filter(c => c.id !== clientId));
        // Persistência
        await firebaseClientService.delete(clientId);
    };

    const handleUpdateAllClients = async (newClients: Client[]) => {
        setIsLoading(true);
        // TODO: Implement bulk import with Firebase
        // For now, we'll import clients one by one
        try {
            // Delete all existing clients
            const existingClients = await firebaseClientService.getAll();
            for (const client of existingClients) {
                await firebaseClientService.delete(client.id);
            }
            // Add new clients
            const newClientsWithIds: Client[] = [];
            for (const client of newClients) {
                const { id, ...clientData } = client;
                const newId = await firebaseClientService.create(clientData);
                newClientsWithIds.push({ ...clientData, id: newId });
            }
            setClients(newClientsWithIds);
            alert(`${newClients.length} cliente(s) importado(s) com sucesso!`);
        } catch (error) {
            console.error("Error importing clients:", error);
            alert("Erro ao importar clientes. Verifique o console para detalhes.");
        } finally {
            setIsLoading(false);
        }
    };

    const navigateToClientPage = (subPage: ClientSubPage | null) => {
        setCurrentClientSubPage(subPage);
    };

    const handleBackFromClientSubPage = () => {
        setCurrentClientSubPage(null);
    }



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
                        if (currentClientSubPage.client) {
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
                return <Dashboard clients={clients} onNavigateToClients={() => setCurrentPage('clients')} onNavigateToPlans={() => setCurrentPage('plans')} />;
            case 'clients':
                return <ClientList clients={clients} onSelectClient={(client) => navigateToClientPage({ page: 'detail', client })} onAddClient={() => navigateToClientPage({ page: 'form' })} onUpdateAllClients={handleUpdateAllClients} onBack={() => setCurrentPage('dashboard')} />;
            case 'statistics':
                return <Statistics clients={clients} />;
            case 'plans':
                return <PlanManager onBack={() => setCurrentPage('dashboard')} />;
            default:
                return <Dashboard clients={clients} onNavigateToClients={() => setCurrentPage('clients')} onNavigateToPlans={() => setCurrentPage('plans')} />;
        }
    };

    return (
        <PlanProvider>
            <div className="min-h-screen bg-slate-900 text-white font-sans pb-20">


                <div className="p-4 sm:p-6">
                    {renderContent()}
                </div>
                {!currentClientSubPage && <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />}
            </div>
        </PlanProvider>
    );
};

export default App;
