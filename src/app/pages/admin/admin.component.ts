// src/app/components/admin/admin-base.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  pageTitle = '';
  itemName = '';
  showAddButton = true;
  searchQuery = '';
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;

  protected onAdd() {
    // To be implemented by child components
  }

  protected onSearch(query: string) {
    // To be implemented by child components
  }

  protected onPageChange(page: number) {
    // To be implemented by child components
    this.currentPage = page;
  }
}