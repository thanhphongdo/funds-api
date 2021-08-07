export class ResponseListBase<T> {
    page?: number;
    perPage?: number;
    totalRow?: number;
    data: Array<T>;

    constructor(page?: number, perPage?: number, totalRow?: number, data: Array<T> = []) {
        this.page = page;
        this.perPage = perPage;
        this.totalRow = totalRow;
        this.data = data;
    }
}