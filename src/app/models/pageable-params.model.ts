export class PageableParams {
    constructor(
        public page: number,
        public size: number,
        public sort?: string[]
    ) {}
}