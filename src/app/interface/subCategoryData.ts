export interface subCategory {
    pkSubCategory: number;
    name: string;
    description: string;
    status: number;
    fkCategory: string;
    fk_category: string;
    category: Category;
    createdAt: string | null;
    updatedAt: string | null; 
  }

interface Category {
    pkCategory: number;
    name: string;
    description: string;
    status: number;
    createdAt: string | null;
    updatedAt: string | null; 
  }
