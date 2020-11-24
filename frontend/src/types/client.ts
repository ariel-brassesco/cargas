import { User } from "./user";
import { Address } from "./address";

export interface Client {
  user: User;
  company: string;
  phone: string;
  address: Address;
}
