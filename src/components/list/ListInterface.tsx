import React from "react";

export interface ItemInterface<T = {}> {
  id: number;
  Avatar: string;
  Name: string;
  Departamento: string;
  loading?: boolean; // Hacer loading opcional
  
  buttons?: (item: T) => React.ReactNode;
}

export interface ListInterface {
  loading: boolean;
  addIcon?:  React.ReactNode;

  title: string;
  button: React.ReactNode;
  filter: boolean;
  data: Array<any>;
  buttons?: (item: any) => React.ReactNode;
  reload: () => void;
}
