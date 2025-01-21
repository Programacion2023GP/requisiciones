import { useState } from "react";

export const UseAuth =()=>{
    const [navigateTo,setNavigateTo] = useState<boolean>()
    const signIn = ()=>{

    }

    const signOut = ()=>{}
    const isLoggedIn = (): boolean => localStorage.getItem("token") ? true : false;
    
    return {
        navigateTo,
        setNavigateTo,
        signIn,
        signOut,
        isLoggedIn
    }
}
export type AuthContext = ReturnType<typeof  UseAuth>
