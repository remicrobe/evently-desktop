import { Event } from './Event.model'
import { User } from "./User.model";

export class Invitation {
    id: number | undefined;
    event: Event | undefined;
    invitationStatus: string | undefined;
    joinDate : Date | undefined;
    leaveDate : Date | undefined;
    user : User | undefined;

    constructor(object?: Partial<Invitation>) {
        this.id = object?.id;
        this.event = object?.event ? new Event(object.event) : undefined;
        this.invitationStatus = object?.invitationStatus;
        this.joinDate = new Date(object?.joinDate!);
        this.leaveDate = new Date(object?.leaveDate!);
        this.user = object?.user ? new User(object.user) : undefined;
    }
}