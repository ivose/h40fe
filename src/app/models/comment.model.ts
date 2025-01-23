import { ReactionStats } from "./reaction-stats.model";

export class Comment {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public content: string,
        public createdAt: Date,
        public reactions?: ReactionStats | null
    ) {}
}