import { HttpParams } from "@angular/common/http";
import { PageableParams } from "../models/pageable-params.model";

export const createParams = (pageable: PageableParams): HttpParams => {
    return new HttpParams()
        .set('page', pageable.page.toString())
        .set('size', pageable.size.toString())
        .set('sort', pageable.sort?.join(',') || '');
}
