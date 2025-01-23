export class User {
    constructor(
        public id: number,
        public email: string,
        public username: string,
        public fullname: string,
        public born: Date,
        public createdAt: Date,
        public followersCount: number,
        public followingCount: number,
        public active: boolean
    ) {}
}
