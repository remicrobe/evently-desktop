import { DateTime } from "luxon";
import { User } from "./User.model";
import { RandomUtils } from "../utils/random.utils";

export class Event {
    id: number | undefined;
    name: string | undefined;
    description: string | undefined;
    location: string | undefined;
    isReccuring: boolean | undefined;
    recurrencePattern: string | undefined;
    interval: number | undefined;
    maxOccurence: number | undefined;
    targetDate: Date | undefined;
    inviteToken: string | undefined;
    categoryID: number | undefined;
    userID: number | undefined;
    user: User | undefined;
    folderID: number | undefined;
    joinedUser: User[] = [];
    friends: string[] = [];
    createdAt: Date | undefined;
    deletedAt: Date | undefined;

    constructor(object?: Partial<Event>) {
        this.id = object?.id;
        this.name = object?.name;
        this.description = object?.description;
        this.location = object?.location;
        this.isReccuring = object?.isReccuring;
        this.recurrencePattern = object?.recurrencePattern ?? 'unique';
        this.interval = object?.interval;
        this.maxOccurence = object?.maxOccurence;
        this.targetDate = new Date(object?.targetDate!);
        this.inviteToken = object?.inviteToken ?? RandomUtils.generateInviteToken();
        this.categoryID = object?.categoryID;
        this.userID = object?.userID;
        this.user = object?.user ? new User(object.user) : undefined;
        this.friends = object?.friends ?? [];
        this.folderID = object?.folderID;
        if (object?.joinedUser) {
            this.friends = [];
            this.joinedUser = [];
            for (const user of object.joinedUser) {
                this.joinedUser.push(new User(user));
                this.friends.push(user.username!);
            }
        }
        this.createdAt = object?.createdAt;
        this.deletedAt = object?.deletedAt;
    }

    getFormattedDate(): string {
        if (!this.targetDate) return "";
        return DateTime.fromJSDate(this.targetDate).toFormat("ccc d LLLL yyyy");
    }

    getDiffToday(): string {
        if (!this.targetDate) return "0";
        return Math.trunc(DateTime.fromJSDate(this.targetDate).diffNow("days").days).toFixed(0);
    }
}
