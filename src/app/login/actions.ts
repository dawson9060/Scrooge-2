"use server";

import { createClient } from "../../../utils/supabase/server";

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  return { success: error ? false : true };
}
