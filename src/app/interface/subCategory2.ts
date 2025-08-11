import { Category } from "./category";

export interface SubCategory {
  pkSubCategory: number;
  name: string;
  description: string;
  status: number;
  createdAt: string | null;
  updatedAt: string | null;
  category?: Category; 
}