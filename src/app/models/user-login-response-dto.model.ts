import { User } from "./user.model";

export class UserLoginResponseDTO {
    constructor(
        public token: string,
        public user: User
    ) {}
}