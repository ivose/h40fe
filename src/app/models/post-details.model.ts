import { CommentDetail } from "./comment-detail.model";
import { ReactionStats } from "./reaction-stats.model";

export class PostDetails {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public title: string,
        public content: string,
        public createdAt: string,
        public updatedAt: string,
        public commentsCount: number,
        public reactions: ReactionStats | null,
        public recentComments: CommentDetail[]
    ) {}
}