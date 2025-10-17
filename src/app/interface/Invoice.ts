import { User } from "./user"; 

export interface InvoiceInterface {
  invoice_id: number;
  fk_user: number | null;
  invoice_amount: number;
  invoice_status: string;
  public_link: string;
  invoice_number: string;
  invoice_date: string; 
  payment_date: string | null; 
  created_at: string;
  updated_at: string;
  status: string;
  user: User; 
}