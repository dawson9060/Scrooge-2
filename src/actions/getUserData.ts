import { User } from "@/types/app";
import { createClient } from "../../utils/supabase/server";

// get user data server-side
const getUserData = async (): Promise<User | null> => {
  const supabase = createClient();

  // access user from Server-Side
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (!authData.user) {
    console.log("no user data found");
    return null;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authData.user.id);

  if (error) {
    console.log("error fetching user data", error);
    return null;
  }

  return data ? (data[0] as User) : null;
};

export default getUserData;
