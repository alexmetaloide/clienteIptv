import React, { createContext, useContext, useState, useEffect } from 'react';
import { Plan } from '../types';
import { supabasePlanService } from '../services/supabaseService';

interface PlanContextType {
    plans: Plan[];
    addPlan: (plan: Omit<Plan, 'id'>) => Promise<void>;
    updatePlan: (plan: Plan) => Promise<void>;
    deletePlan: (id: string) => Promise<void>;
    isLoading: boolean;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const DEFAULT_PLANS: Omit<Plan, 'id'>[] = [
    { name: '1 TELA', price: 25 },
    { name: '2 TELAS', price: 35 },
    { name: '1 TELA + YouTube_P', price: 45 },
    { name: '2 TELAS + YouTube_P', price: 55 },
];

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const fetchedPlans = await supabasePlanService.getAll();
                if (fetchedPlans.length === 0) {
                    // Initialize with default plans if database is empty
                    for (const plan of DEFAULT_PLANS) {
                        await supabasePlanService.create(plan);
                    }
                    const newPlans = await supabasePlanService.getAll();
                    setPlans(newPlans);
                } else {
                    setPlans(fetchedPlans);
                }
            } catch (error) {
                console.error("Failed to load plans from Supabase", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadPlans();
    }, []);

    const addPlan = async (newPlan: Omit<Plan, 'id'>) => {
        try {
            const newId = await supabasePlanService.create(newPlan);
            setPlans(prev => [...prev, { ...newPlan, id: newId }]);
        } catch (error) {
            console.error("Error adding plan:", error);
            throw error;
        }
    };

    const updatePlan = async (updatedPlan: Plan) => {
        try {
            await supabasePlanService.update(updatedPlan.id, updatedPlan);
            setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
        } catch (error) {
            console.error("Error updating plan:", error);
            throw error;
        }
    };

    const deletePlan = async (id: string) => {
        try {
            await supabasePlanService.delete(id);
            setPlans(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting plan:", error);
            throw error;
        }
    };

    return (
        <PlanContext.Provider value={{ plans, addPlan, updatePlan, deletePlan, isLoading }}>
            {children}
        </PlanContext.Provider>
    );
};

export const usePlans = () => {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error('usePlans must be used within a PlanProvider');
    }
    return context;
};
