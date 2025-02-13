import { User } from "./User.model";

export class Folder {
    id: number | undefined;
    name: string | undefined;
    inviteToken: string | undefined;
    user: User | undefined;
    friends: string[] = [];
    joinedUser: User[] = [];
    createdAt: Date | undefined;
    deletedAt: Date | undefined;

    constructor(object?: Partial<Folder>) {
        this.id = object?.id;
        this.name = object?.name;
        this.inviteToken = object?.inviteToken;
        this.user = object?.user ? new User(object.user) : undefined;
        this.friends = object?.friends ?? [];

        if (object?.joinedUser) {
            for (const user of object.joinedUser) {
                this.joinedUser.push(new User(user));
                this.friends.push(user.username!);
            }
        }

        this.createdAt = object?.createdAt;
        this.deletedAt = object?.deletedAt;
    }
}
