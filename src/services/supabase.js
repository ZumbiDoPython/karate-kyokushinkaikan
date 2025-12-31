import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
// Substitua estas variáveis pelas suas credenciais do Supabase
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Criar cliente Supabase apenas se as credenciais estiverem configuradas
let supabase = null;
if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY') {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.error('Error creating Supabase client:', error);
  }
}

export { supabase };

/**
 * Buscar todas as imagens da tabela wp_midia
 */
export const getImagesFromSupabase = async () => {
  try {
    // Verificar se as credenciais estão configuradas
    if (!supabase) {
      console.warn('Supabase credentials not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your .env file');
      return [];
    }

    const { data, error } = await supabase
      .from('wp_midia')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching images from Supabase:', error);
      return [];
    }

    console.log('Images fetched from Supabase:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error in getImagesFromSupabase:', error);
    return [];
  }
};

/**
 * Buscar uma imagem específica por ID
 */
export const getImageById = async (id) => {
  try {
    if (!supabase) {
      console.warn('Supabase credentials not configured');
      return null;
    }

    const { data, error } = await supabase
      .from('wp_midia')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching image by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getImageById:', error);
    return null;
  }
};

