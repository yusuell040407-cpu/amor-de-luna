
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mecwwebobaqoxhkypkzo.supabase.co';
const supabaseAnonKey = 'sb_publishable_q5_OGm_H6XvOBcUVOOwMvA_yyBMlYkZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
