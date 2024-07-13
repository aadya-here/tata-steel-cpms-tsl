import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ntkzcrtlciccappgmtle.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50a3pjcnRsY2ljY2FwcGdtdGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNzUyMzQsImV4cCI6MjAzMzk1MTIzNH0.djqSdISIfBz_49lkpNuEOMlAMBzPOF1umvzhtJbmobo';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
