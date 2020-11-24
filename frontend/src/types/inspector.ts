import { User } from "./user";
import { Address } from "./address";

export interface Inspector {
  user: User;
  phone: string;
  address: Address;
}
