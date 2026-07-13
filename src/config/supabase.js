import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mmycsntytdkjpzrumavk.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teWNzbnR5dGRranB6cnVtYXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NTg1MDgsImV4cCI6MjA5NzQzNDUwOH0.fomV5uPM_qkJqhUUqoTnZh_eHPhAhdvhDwqgaHQSSnc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
