import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../../models/pageable-params.model';
import { PageResponse } from '../../models/page-response.model';
import { ReactionCategory } from '../../models/reaction-category.model';
import { environment } from '../../../environments/environment.generated';

@Injectable({
  providedIn: 'root'
})
export class AdminReactionCategoryService {
  private apiUrl = `${environment.apiUrl}/admin/reaction-categories`;

  constructor(private http: HttpClient) {}

  getAllCategories(search?: string, pageable: PageableParams = { page: 0, size: 10 }): Observable<PageResponse<ReactionCategory>> {
    let params: any = { ...pageable };
    if (search) params.search = search;
    return this.http.get<PageResponse<ReactionCategory>>(this.apiUrl, { params });
  }

  createCategory(categoryData: { name: string; icon?: string }): Observable<ReactionCategory> {
    return this.http.post<ReactionCategory>(this.apiUrl, categoryData);
  }

  updateCategory(categoryId: number, categoryData: { name?: string; icon?: string }): Observable<ReactionCategory> {
    return this.http.put<ReactionCategory>(`${this.apiUrl}/${categoryId}`, categoryData);
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }
}