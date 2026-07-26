import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bhtbdnuapvyqdigwgyji.supabase.co";
const supabaseAnonKey = "sb_publishable_GUbaOnOQvhrTnTWkVQWeYQ_c4AmqaHy";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
