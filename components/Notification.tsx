import React from 'react';
import { AlertIcon, CloseIcon } from './icons/Icons';

interface NotificationProps {
    message: string;
    onDismiss: () => void;
    onClick: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onDismiss, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="flex items-center bg-slate-700 border border-orange-500/50 rounded-lg shadow-lg p-3 w-auto max-w-sm mx-4 sm:mx-0 cursor-pointer animate-fade-in-right"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex-shrink-0 text-orange-400">
                <AlertIcon />
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm text-white">{message}</p>
            </div>
            <button 
                onClick={(e) => {
                    e.stopPropagation(); // Impede que o clique dispare o onClick do contêiner principal
                    onDismiss();
                }}
                className="ml-3 p-1 rounded-full hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
                aria-label="Fechar notificação"
            >
                <CloseIcon />
            </button>
        </div>
    );
};

export default Notification;
