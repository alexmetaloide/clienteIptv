import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    Timestamp
} from "firebase/firestore";
import { db } from "../config/firebase";
import { Client, Plan } from "../types";

// Collections
const CLIENTS_COLLECTION = "clients";
const PLANS_COLLECTION = "plans";

// Client Service
export const firebaseClientService = {
    getAll: async (): Promise<Client[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, CLIENTS_COLLECTION));
            const clients: Client[] = [];
            querySnapshot.forEach((doc) => {
                clients.push({ id: doc.id, ...doc.data() } as Client);
            });
            return clients;
        } catch (error) {
            console.error("Error getting clients:", error);
            return [];
        }
    },

    create: async (client: Omit<Client, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, CLIENTS_COLLECTION), client);
            return docRef.id;
        } catch (error) {
            console.error("Error creating client:", error);
            throw error;
        }
    },

    update: async (clientId: string, client: Partial<Client>): Promise<void> => {
        try {
            const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
            await updateDoc(clientRef, client as any);
        } catch (error) {
            console.error("Error updating client:", error);
            throw error;
        }
    },

    delete: async (clientId: string): Promise<void> => {
        try {
            const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
            await deleteDoc(clientRef);
        } catch (error) {
            console.error("Error deleting client:", error);
            throw error;
        }
    }
};

// Plan Service
export const firebasePlanService = {
    getAll: async (): Promise<Plan[]> => {
        try {
            const querySnapshot = await getDocs(collection(db, PLANS_COLLECTION));
            const plans: Plan[] = [];
            querySnapshot.forEach((doc) => {
                plans.push({ id: doc.id, ...doc.data() } as Plan);
            });
            return plans;
        } catch (error) {
            console.error("Error getting plans:", error);
            return [];
        }
    },

    create: async (plan: Omit<Plan, 'id'>): Promise<string> => {
        try {
            const docRef = await addDoc(collection(db, PLANS_COLLECTION), plan);
            return docRef.id;
        } catch (error) {
            console.error("Error creating plan:", error);
            throw error;
        }
    },

    update: async (planId: string, plan: Partial<Plan>): Promise<void> => {
        try {
            const planRef = doc(db, PLANS_COLLECTION, planId);
            await updateDoc(planRef, plan as any);
        } catch (error) {
            console.error("Error updating plan:", error);
            throw error;
        }
    },

    delete: async (planId: string): Promise<void> => {
        try {
            const planRef = doc(db, PLANS_COLLECTION, planId);
            await deleteDoc(planRef);
        } catch (error) {
            console.error("Error deleting plan:", error);
            throw error;
        }
    }
};
