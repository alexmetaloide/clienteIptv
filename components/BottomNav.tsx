
import React from 'react';
import { HomeIcon, UsersIcon, ChartBarIcon } from './icons/Icons';

type Page = 'dashboard' | 'clients' | 'statistics' | 'plans';

interface BottomNavProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${isActive ? 'text-orange-400' : 'text-slate-400 hover:text-orange-300'}`}
    >
        {icon}
        <span className="text-xs mt-1">{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-800 border-t border-slate-700 flex justify-around items-center shadow-lg md:hidden">
            <NavItem
                icon={<HomeIcon />}
                label="Início"
                isActive={currentPage === 'dashboard'}
                onClick={() => setCurrentPage('dashboard')}
            />
            <NavItem
                icon={<UsersIcon />}
                label="Clientes"
                isActive={currentPage === 'clients'}
                onClick={() => setCurrentPage('clients')}
            />
            <NavItem
                icon={<ChartBarIcon />}
                label="Estatísticas"
                isActive={currentPage === 'statistics'}
                onClick={() => setCurrentPage('statistics')}
            />
        </div>
    );
};

export default BottomNav;
