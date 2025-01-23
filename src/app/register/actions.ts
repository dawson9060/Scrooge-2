"use server";

import { createClient } from "../../../utils/supabase/server";

export async function signup(email: string, password: string) {
  const supabase = createClient();

  const { data, error: signupError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signupError) {
    return { success: false };
  }

  return { success: true };
}
