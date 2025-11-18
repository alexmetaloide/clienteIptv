
import React, { useState, useEffect } from 'react';

interface ReminderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (message: string) => void;
    initialMessage: string;
}

const ReminderDialog: React.FC<ReminderDialogProps> = ({ isOpen, onClose, onSend, initialMessage }) => {
    const [message, setMessage] = useState(initialMessage);

    useEffect(() => {
        if (isOpen) {
            setMessage(initialMessage);
        }
    }, [isOpen, initialMessage]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 border border-slate-700">
                <h2 className="text-xl font-bold text-white">Editar Mensagem de Lembrete</h2>
                <p className="text-slate-400 mt-2 mb-4">Ajuste o texto abaixo antes de enviar para o WhatsApp.</p>
                
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="w-full bg-slate-700 text-white placeholder-slate-400 p-3 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => onSend(message)}
                        className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Enviar via WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderDialog;
