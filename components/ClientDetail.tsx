
import React, { useState } from 'react';
import { Client, Status } from '../types';
import { BackIcon, EditIcon, WhatsAppIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from './icons/Icons';
import ReminderDialog from './ReminderDialog';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 border border-slate-700">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <p className="text-slate-300 mt-2 mb-6">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

interface ClientDetailProps {
    client: Client;
    onBack: () => void;
    onEdit: () => void;
    onDelete: (clientId: string) => void;
    onUpdateStatus: (client: Client) => void;
}

const DetailItem: React.FC<{ label: string, value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 border-b border-slate-700">
        <p className="text-sm text-slate-400">{label}</p>
        <div className="text-lg text-white font-medium">{value}</div>
    </div>
);

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onBack, onEdit, onDelete, onUpdateStatus }) => {
    const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
    const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
    const annualValue = client.monthlyValue * 12;

    const defaultReminderMessage = `🔔 Lembrete de Pagamento IPTV
Olá! Seu plano de IPTV está próximo do vencimento.

💰 Forma de pagamento: Pix
📱 Chave Pix (celular): 85992628985
👤 Nome: Alex Pereira Teotonio
🏦 Banco: PicPay

Após o pagamento, envie o comprovante para confirmar e renovar sua assinatura. ✅`;

    const handleSendReminder = (message: string) => {
        if (!client.contact) return;
        const whatsappUrl = `https://wa.me/${client.contact}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        setIsReminderDialogOpen(false);
    };

    const handleToggleStatus = () => {
        const newStatus = client.status === Status.Ativo ? Status.Inativo : Status.Ativo;
        onUpdateStatus({ ...client, status: newStatus });
    };

    const handleDeleteRequest = () => {
        setIsConfirmDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete(client.id);
        setIsConfirmDeleteDialogOpen(false);
        onBack();
    };
    
    return (
        <>
            <div className="space-y-6">
                <header className="flex items-center">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-700">
                        <BackIcon />
                    </button>
                    <h1 className="text-2xl font-bold text-white ml-4">{client.name}</h1>
                </header>
                
                <div className="bg-slate-800 p-4 sm:p-6 rounded-lg">
                    <DetailItem label="Contato" value={client.contact || 'Não informado'} />
                    <DetailItem label="Plano" value={client.plan} />
                    <DetailItem label="Valor Mensal" value={client.monthlyValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    <DetailItem label="Dia do Vencimento" value={`Todo dia ${client.dueDate}`} />
                    <DetailItem label="Status" value={
                        <span className={`font-bold ${client.status === Status.Ativo ? 'text-green-400' : 'text-red-400'}`}>
                            {client.status}
                        </span>} 
                    />
                    <DetailItem label="Valor Total Anual" value={annualValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button onClick={onEdit} className="flex flex-col items-center p-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                        <EditIcon />
                        <span className="mt-1 text-sm font-medium">Editar</span>
                    </button>
                    <button 
                        onClick={() => setIsReminderDialogOpen(true)} 
                        disabled={!client.contact}
                        className={`flex flex-col items-center p-3 rounded-lg transition-colors ${!client.contact ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}>
                        <WhatsAppIcon />
                        <span className="mt-1 text-sm font-medium">Lembrete</span>
                    </button>
                    <button onClick={handleToggleStatus} className={`flex flex-col items-center p-3 ${client.status === Status.Ativo ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} rounded-lg transition-colors`}>
                        {client.status === Status.Ativo ? <XCircleIcon /> : <CheckCircleIcon />}
                        <span className="mt-1 text-sm font-medium">{client.status === Status.Ativo ? 'Inativar' : 'Ativar'}</span>
                    </button>
                    <button onClick={handleDeleteRequest} className="flex flex-col items-center p-3 bg-slate-600 hover:bg-slate-700 rounded-lg transition-colors">
                        <TrashIcon />
                        <span className="mt-1 text-sm font-medium">Excluir</span>
                    </button>
                </div>
            </div>

            <ConfirmationDialog
                isOpen={isConfirmDeleteDialogOpen}
                onClose={() => setIsConfirmDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja excluir o cliente ${client.name}? Esta ação não pode ser desfeita.`}
            />

            <ReminderDialog
                isOpen={isReminderDialogOpen}
                onClose={() => setIsReminderDialogOpen(false)}
                onSend={handleSendReminder}
                initialMessage={defaultReminderMessage}
            />
        </>
    );
};

export default ClientDetail;