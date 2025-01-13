export class PageResponse<T> {
    constructor(
        public content: T[],
        public totalPages: number,
        public totalElements: number,
        public size: number,
        public number: number,
        public first: boolean,
        public last: boolean,
        public empty: boolean
    ) {}
}