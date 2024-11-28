// "IDUsuario": 2,
// "Usuario": "alberto",
// "Nombre": "Alberto",
// "Paterno": "Lespron",
// "Materno": "Cortez",
// "NombreCompleto": "Lespron Cortez Alberto",
// "IDDepartamento": 27,
// "Rol": "REQUISITOR",
// "Password": "alberto123",
// "Activo"

export type TypeUsers ={
    IDUsuario: number;
    Usuario: string;
    Nombre: string;
    Paterno: string;
    Materno: string;
    NombreCompleto: string;
    IDDepartamento: number;
    Rol: string;
    Password: string;
    Activo: boolean;
}
export type TypeDepartamentos ={
    IDDepartamento: number;
    Nombre_Departamento: string;
    // IDGerencia: number;
}