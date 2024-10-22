export interface InterfaceModal {
    open:boolean,
    setOpen:(open:boolean) => void,
    children?:React.ReactNode,
    messageButton?:string,
    handleButton:() =>void,
    title?:string,

}

