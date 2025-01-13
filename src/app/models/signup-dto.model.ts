export class SignupDto {
    constructor(
        public email: string,
        public password: string,
        public fullName: string,
        public username: string,
        public born: string
    ) {}
}