export declare enum UserRole {
    MANAGER = "manager",
    VOLUNTEER = "volunteer"
}
export declare class User {
    id: number;
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
}
