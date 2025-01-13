export class UpdateProfileDTO {
    constructor(
        public email: string,
        public fullName: string,
        public username: string,
        public born: string
    ) {}
}