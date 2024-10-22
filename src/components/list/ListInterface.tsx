import React from "react";

export interface ItemInterface{
  id?: string;
  iconItem?: React.ReactNode;
  titleItem: string;
  subtitleItem?: string;
  loading?: boolean; // Hacer loading opcional
  item: Record<string,any>;
  buttons?: (item: any) => React.ReactNode;
}

export interface ListInterface {
  loading: boolean;
  addIcon?:  React.ReactNode;
  titleItem: string;
  subtitleItem?: string;
  iconItem?: React.ReactNode;
  title: string;
  button: React.ReactNode;
  filter: boolean;
  data: Array<any>;
  buttons?: (item: any) => React.ReactNode;
  reload?: () => void;
}
