export class Post {
    constructor(
        public id: number,
        public userId: number,
        public username: string,
        public title: string,
        public content: string,
        public createdAt: Date,
        public updatedAt: Date,
        public commentsCount: number,
        public reactionsCount: number
    ) {}
}