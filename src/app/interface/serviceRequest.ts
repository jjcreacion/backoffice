import { User } from "./user";
import { Category, SubCategory } from "./category";

export interface RequestService {
  requestId: number;
  serviceType?: number;
  serviceDescription: string;
  address: string;
  latitude: string; 
  longitude: string; 
  fkRequestStatus: number | null; 
  fkUser: User;
  fkCategory: Category;
  fkSubCategory: SubCategory; 
  createdAt: string | null;
  updatedAt: string | null;
}
