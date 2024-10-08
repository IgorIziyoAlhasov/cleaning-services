import { supabase } from '../supabaseClient';

// Fetch clients
export const fetchClients = async () => {
    const { data, error } = await supabase.from('clients').select('*');
    if (error) throw error;
    return data;
};

// Fetch days of week
export const fetchDaysOfWeek = async () => {
    const { data, error } = await supabase.from('days_of_week').select('*');
    if (error) throw error;
    return data;
};

// Create a new client
export const createClient = async (clientData) => {
    const { data, error } = await supabase.from('clients').insert([clientData]);
    if (error) throw error;
    return data;
};

// Update an existing client
export const updateClient = async (clientId, clientData) => {
    const { data, error } = await supabase.from('clients').update(clientData).eq('id', clientId);
    if (error) throw error;
    return data;
};

// Delete a client (if needed)
export const deleteClient = async (clientId) => {
    const { data, error } = await supabase.from('clients').delete().eq('id', clientId);
    if (error) throw error;
    return data;
};

// Fetch business centers
export const fetchBusinessCenters = async () => {
    const { data, error } = await supabase
        .from('business_centers')
        .select('*');

    if (error) {
        console.error('Error fetching business centers:', error);
        return [];
    }

    return data;
};