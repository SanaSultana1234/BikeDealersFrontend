export interface UserRegister {
    Id?: Number;
    username: string;
    email: string;
    address?: string;
    password: string;
    confirmPassword: string; 
    Role?: ('Dealer' | 'User' | 'Manufacturer');
}
