import { useEffect, useState } from "react"
import { createClient } from "../../../utils/supabase/client";
import { User } from "@/types/app";

export const useFetchUserInfo = () => {
    const [userInfo, setUserInfo] = useState<User>();

    const supabase = createClient();

    // const { data: authData, error: authError } = supabase.auth.getUser();

    useEffect(() => {
        const channel = supabase
          .channel('*')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` }, (payload) =>
            console.log('payload', payload)
          )
          .subscribe()
    
        return () => {
          supabase.removeChannel(channel)
        }
      }, [])

    const fetchInfo = async () => {
        const { data: authData, error: authError } = await supabase.auth.getUser();

        const { data, error } = await supabase.from('users').select('*').eq('id', authData.user!.id);

        if (data) setUserInfo(data[0]);
    }

    return {
        userInfo,
        fetchInfo,
    }
}
// export const useFetchUserInfo = () => {
//     const [userInfo, setUserInfo] = useState<User>();

//     const supabase = createClient();

//     // const { data: authData, error: authError } = supabase.auth.getUser();

//     const fetchInfo = async () => {
//         const { data: authData, error: authError } = await supabase.auth.getUser();

//         const { data, error } = await supabase.from('users').select('*').eq('id', authData.user!.id);

//         if (data) setUserInfo(data[0]);
//     }

//     return {
//         userInfo,
//         fetchInfo,
//     }
// }