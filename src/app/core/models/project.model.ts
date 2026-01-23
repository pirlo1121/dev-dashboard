export interface IProject {
    _id?: string;
    name: string;
    subtitle?: string;
    description?: string;
    image?: string;
    repository?: string;
    stack: string[];
    deploy?: string;
    userId?: string;
}

export interface IProjectsResponse {
    ok: boolean;
    projects: IProject[];
}

export interface IProjectResponse {
    ok: boolean;
    project: IProject;
}