export class PasswordChangeDto {
    constructor(
        public oldPassword: string,
        public newPassword: string
    ) {}
}