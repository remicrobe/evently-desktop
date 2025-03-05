export class User {
    id: number | undefined;
    username: string | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
    provider: string | undefined;
    isDeleted: boolean | undefined;
    isCompleted: boolean | undefined;
    createdAt: Date | undefined;
    deletedAt: Date | undefined;

    constructor(object?: Partial<User>) {
        this.id = object?.id;
        this.username = object?.username;
        this.firstName = object?.firstName ? `${object?.firstName.charAt(0).toUpperCase()} ${object?.firstName.slice(1).toLowerCase()}` : undefined;
        this.lastName = object?.lastName ? object.lastName.toUpperCase() : undefined;
        this.email = object?.email;
        this.password = object?.password;
        this.provider = object?.provider;
        this.isDeleted = object?.isDeleted;
        this.isCompleted = object?.isCompleted;
        this.createdAt = object?.createdAt;
        this.deletedAt = object?.deletedAt;
    }

    get fullName(): string {
        return `${this.lastName ?? ''} ${this.firstName ?? ''}`.trim();
    }
}