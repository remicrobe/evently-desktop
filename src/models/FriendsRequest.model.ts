import { User } from "./User.model";

export class FriendsRequest {
    id: number | undefined;
    asker: User | undefined;
    receiver: User | undefined;
    createdAt: Date | undefined;

    constructor(object?: Partial<FriendsRequest>) {
        this.id = object?.id;
        this.asker = object?.asker ? new User(object.asker) : undefined;
        this.receiver = object?.receiver ? new User(object.receiver) : undefined;
        this.createdAt = object?.createdAt;
    }
}
