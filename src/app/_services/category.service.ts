// src/app/_services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../_models/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/category`; 
  constructor(private http: HttpClient) {}

  // Get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}`);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }

  // Create a new category
  createCategory(categoryData: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}`, categoryData);
  }

  // Update an existing category by ID
  updateCategory(id: number, categoryData: Category): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, categoryData);
  }

  // Delete a category by ID
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
