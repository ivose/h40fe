import { ReactionCount } from "./reaction-count.model";

export class ReactionStats {
    constructor(
        public counts: ReactionCount[],
        public myReactionCatId: number
    ) {}
}