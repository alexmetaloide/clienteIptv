
import { supabase } from "../config/supabase";
import { Client, Plan } from "../types";

// Table names
const CLIENTS_TABLE = "clients";
const PLANS_TABLE = "plans";

// Client Service
export const supabaseClientService = {
    getAll: async (): Promise<Client[]> => {
        try {
            const { data, error } = await supabase
                .from(CLIENTS_TABLE)
                .select('*');

            if (error) throw error;
            return data as Client[];
        } catch (error) {
            console.error("Error getting clients:", error);
            return [];
        }
    },


    create: async (client: Client | Omit<Client, 'id'>): Promise<string> => {
        try {
            // Remove 'id' if present to let Supabase generate it
            const { id, ...clientData } = client as Client;

            const { data, error } = await supabase
                .from(CLIENTS_TABLE)
                .insert([clientData])
                .select()
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error("Error creating client:", error);
            throw error;
        }
    },

    update: async (clientId: string, client: Partial<Client>): Promise<void> => {
        try {
            const { error } = await supabase
                .from(CLIENTS_TABLE)
                .update(client)
                .eq('id', clientId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating client:", error);
            throw error;
        }
    },

    delete: async (clientId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from(CLIENTS_TABLE)
                .delete()
                .eq('id', clientId);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting client:", error);
            throw error;
        }
    }
};

// Plan Service
export const supabasePlanService = {
    getAll: async (): Promise<Plan[]> => {
        try {
            const { data, error } = await supabase
                .from(PLANS_TABLE)
                .select('*');

            if (error) throw error;
            return data as Plan[];
        } catch (error) {
            console.error("Error getting plans:", error);
            return [];
        }
    },

    create: async (plan: Omit<Plan, 'id'>): Promise<string> => {
        try {
            const { data, error } = await supabase
                .from(PLANS_TABLE)
                .insert([plan])
                .select()
                .single();

            if (error) throw error;
            return data.id;
        } catch (error) {
            console.error("Error creating plan:", error);
            throw error;
        }
    },

    update: async (planId: string, plan: Partial<Plan>): Promise<void> => {
        try {
            const { error } = await supabase
                .from(PLANS_TABLE)
                .update(plan)
                .eq('id', planId);

            if (error) throw error;
        } catch (error) {
            console.error("Error updating plan:", error);
            throw error;
        }
    },

    delete: async (planId: string): Promise<void> => {
        try {
            const { error } = await supabase
                .from(PLANS_TABLE)
                .delete()
                .eq('id', planId);

            if (error) throw error;
        } catch (error) {
            console.error("Error deleting plan:", error);
            throw error;
        }
    }
};
