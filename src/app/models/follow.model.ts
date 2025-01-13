import { User } from "./user.model";

export class Follow {
    constructor(
        public id: number,
        public follower: User,
        public followee: User,
        public createdAt: Date
    ) {}
}