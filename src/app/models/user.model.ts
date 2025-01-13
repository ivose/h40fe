export class User {
    constructor(
        public id: number,
        public email: string,
        public username: string,
        public fullName: string,
        public born: Date,
        public createdAt: Date,
        public updatedAt: Date,
        public active: boolean,
        public admin: boolean
    ) {}
}
