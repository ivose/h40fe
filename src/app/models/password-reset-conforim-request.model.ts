export class PasswordResetConfirmRequestDTO {
    constructor(
        public newPassword: string,
        public token: string
    ) {}
}