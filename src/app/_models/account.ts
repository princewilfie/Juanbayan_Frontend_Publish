import { Role } from './role';

export class Account {
    id: string;
    acc_email: string;
    acc_passwordHash: string;
    acc_firstName: string;
    acc_lastName: string;
    acc_pnumber: string;
    acc_role: Role;
    jwtToken?: string;
}