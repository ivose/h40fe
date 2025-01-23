// src/app/pages/admin/reactions/admin-reactions.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminReactionCategoryService } from '../../../services/admin/admin-reaction-category.service';
import { ReactionCategory } from '../../../models/reaction-category.model';
import { PageableParams } from '../../../models/pageable-params.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { AdminReactionsItemComponent } from './admin-reactions-item/admin-reactions-item.component';
import { AdminReactionsFormComponent } from './admin-reactions-form/admin-reactions-form.component';

@Component({
  selector: 'app-admin-reactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    AdminReactionsItemComponent,
    AdminReactionsFormComponent
  ],
  templateUrl: './admin-reactions.component.html',
  styleUrls: ['./admin-reactions.component.scss']
})
export class AdminReactionsComponent implements OnInit {
  categories: ReactionCategory[] = [];
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  searchQuery = '';
  loading = false;
  error = '';
  showModal = false;
  editingCategory: ReactionCategory | null = null;

  constructor(private adminReactionService: AdminReactionCategoryService) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    const pageable = new PageableParams(this.currentPage - 1, this.pageSize, ['name']);

    this.adminReactionService.getAllCategories(this.searchQuery, pageable)
      .subscribe({
        next: (response) => {
          this.categories = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading reaction categories:', err);
          this.error = 'Failed to load reaction categories';
          this.loading = false;
        }
      });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadCategories();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadCategories();
  }

  openCreateModal() {
    this.editingCategory = null;
    this.showModal = true;
    this.error = '';
  }

  openEditModal(category: ReactionCategory) {
    this.editingCategory = category;
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.editingCategory = null;
    this.error = '';
  }

  onSaveCategory(data: { name: string; icon: string }) {
    if (this.editingCategory) {
      this.adminReactionService.updateCategory(this.editingCategory.id, data)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error updating reaction category:', err);
            this.error = err.error?.message || 'Failed to update reaction category';
          }
        });
    } else {
      this.adminReactionService.createCategory(data)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadCategories();
          },
          error: (err) => {
            console.error('Error creating reaction category:', err);
            this.error = err.error?.message || 'Failed to create reaction category';
          }
        });
    }
  }

  onDeleteCategory(category: ReactionCategory) {
    if (confirm(`Are you sure you want to delete the "${category.name}" reaction?`)) {
      this.adminReactionService.deleteCategory(category.id)
        .subscribe({
          next: () => this.loadCategories(),
          error: (err) => {
            console.error('Error deleting reaction category:', err);
            this.error = 'Failed to delete reaction category';
          }
        });
      //commonEmojis = ['👍', '❤️', '😄', '😢', '😮', '😡', '👏', '🎉']; .
    }
  }
}