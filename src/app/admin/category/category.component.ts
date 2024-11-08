// src/app/admin/category-admin/category-admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Category } from '../../_models/category';
import { CategoryService } from '../../_services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-admin',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryAdminComponent implements OnInit {
  categories: Category[] = [];
  categoryForm: FormGroup;
  isEditing: boolean = false;
  currentCategoryId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      Category_Name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  // Load all categories from the server
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => (this.categories = data),
      (error) => console.error('Error loading categories:', error)
    );
  }

  // Add or update category
  onSubmit(): void {
    if (this.isEditing && this.currentCategoryId) {
      // Update category
      this.categoryService.updateCategory(this.currentCategoryId, this.categoryForm.value).subscribe(
        () => {
          this.loadCategories();
          this.resetForm();
        },
        (error) => console.error('Error updating category:', error)
      );
    } else {
      // Create new category
      this.categoryService.createCategory(this.categoryForm.value).subscribe(
        () => {
          this.loadCategories();
          this.resetForm();
        },
        (error) => console.error('Error creating category:', error)
      );
    }
  }

  // Set form for editing a specific category
  editCategory(category: Category): void {
    this.categoryForm.patchValue(category);
    this.isEditing = true;
    this.currentCategoryId = category.Category_ID || null;
  }

  // Delete a category
  deleteCategory(id: number): void {
    this.categoryService.deleteCategory(id).subscribe(
      () => this.loadCategories(),
      (error) => console.error('Error deleting category:', error)
    );
  }

  // Reset form after submit or cancel
  resetForm(): void {
    this.categoryForm.reset();
    this.isEditing = false;
    this.currentCategoryId = null;
  }
}
