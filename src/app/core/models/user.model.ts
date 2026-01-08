export interface IUser {
    _id?: string;
    name: string;
    age: number;
    profession: string;
    email: string;
    password?: string;
    role: string;
    languages: string[];
    skills: string[];
    bio?: string;
    avatar?: string;
    socialLinks: {
        github?: string;
        linkedin?: string;
    };
}
