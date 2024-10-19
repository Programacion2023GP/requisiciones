export interface UsersInterface {
  url: string;
  data: Array<User>;
}
export interface User {
  id: number;
  Avatar: string;
  Name: string;
  Departamento: string;
}

export const initialUsersState: UsersInterface = {
  url: "users",
  data: [],
};
