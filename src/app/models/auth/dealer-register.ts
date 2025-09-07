import { UserRegister } from "./user-register";

export interface DealerRegister extends UserRegister  {
  //dealer
  storeName: string;
  storageCapacity: number;
  inventory: number;
}
