import { UserRegister } from "./user-register";

export interface ManufacturerRegister extends UserRegister {
    //manufacturer
  companyName: string;
  registrationNumber: string;
}
