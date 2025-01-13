import { ReactionCategory } from "./reaction-category.model";

export class CommentReaction {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public commentId: number,
        public category: ReactionCategory,
        public createdAt: Date
    ) {}
}