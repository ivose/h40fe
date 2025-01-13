import { CommentDetail } from "./comment-detail.model";
import { ReactionSummary } from "./reaction-summary.model";

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
        public reactionsCount: number,
        public reactions: ReactionSummary[],
        public recentComments: CommentDetail[]
    ) {}
}