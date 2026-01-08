export interface IProject {
    _id?: string;
    name: string;
    description?: string;
    image?: string;
    repository?: string;
    stack: string[];
    deploy?: string;
    userId?: string;
}

export interface IProjectResponse {
    ok: boolean;
    projects: IProject[];
}