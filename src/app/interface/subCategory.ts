import { Category } from "./category2";
import { ClientType } from "./clientType";
import { ServiceType } from "./serviceType";

export interface SubCategory {
  pkSubCategory: number;
  name: string;
  description: string;
  status: number;
  createdAt: string | null;
  updatedAt: string | null;
  category: Category;
  clientType: ClientType;
  serviceType: ServiceType;
}

  
  