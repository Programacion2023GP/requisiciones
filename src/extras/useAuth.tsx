export const UseAuth =()=>{
    const signIn = ()=>{

    }
    const signOut = ()=>{}
    const isLoggedIn = (): boolean => localStorage.getItem("token") ? true : false;
    
    return {
        signIn,
        signOut,
        isLoggedIn
    }
}
export type AuthContext = ReturnType<typeof  UseAuth>
