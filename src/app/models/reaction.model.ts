import { ReactionCategory } from "./reaction-category.model";

export class Reaction {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public postId: number,
        public category: ReactionCategory,
        public createdAt: Date
    ) {}
}