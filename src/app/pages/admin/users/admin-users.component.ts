// src/app/pages/admin/users/admin-users/admin-users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminUserService } from '../../../services/admin/admin-user.service';
import { User } from '../../../models/user.model';
import { PageableParams } from '../../../models/pageable-params.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { AdminUsersItemComponent } from './admin-users-item/admin-users-item.component';
import { AdminUsersFormComponent } from './admin-users-form/admin-users-form.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    AdminUsersItemComponent,
    AdminUsersFormComponent
  ],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.scss']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  searchQuery = '';
  activeFilter = '';
  showModal = false;
  editingUser: User | null = null;
  error = '';
  loading = false;

  constructor(private adminUserService: AdminUserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    const pageable = new PageableParams(this.currentPage - 1, this.pageSize, ['username']);
    const active = this.activeFilter === '' ? undefined : this.activeFilter === 'true';

    this.adminUserService.getAllUsers(this.searchQuery, active, pageable)
      .subscribe({
        next: (response) => {
          this.users = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading users:', err);
          this.error = 'Failed to load users';
          this.loading = false;
        }
      });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  openCreateModal() {
    this.editingUser = null;
    this.showModal = true;
    this.error = '';
  }

  openEditModal(user: User) {
    this.editingUser = user;
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.editingUser = null;
    this.error = '';
  }

  onSaveUser(userData: any) {
    if (this.editingUser) {
      this.adminUserService.updateUser(this.editingUser.id, userData)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error updating user:', err);
            this.error = err.error?.message || 'Failed to update user';
          }
        });
    } else {
      this.adminUserService.createUser(userData)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadUsers();
          },
          error: (err) => {
            console.error('Error creating user:', err);
            this.error = err.error?.message || 'Failed to create user';
          }
        });
    }
  }

  onDeleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      this.adminUserService.deleteUser(user.id)
        .subscribe({
          next: () => this.loadUsers(),
          error: (err) => {
            console.error('Error deleting user:', err);
            this.error = 'Failed to delete user';
          }
        });
    }
  }

  onToggleStatus(user: User) {
    this.adminUserService.updateUserStatus(user.id, !user.active)
      .subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          console.error('Error toggling user status:', err);
          this.error = 'Failed to update user status';
        }
      });
  }

  onToggleAdmin(user: User) {
    this.adminUserService.updateUserAdmin(user.id, !user.admin)
      .subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          console.error('Error toggling admin status:', err);
          this.error = 'Failed to update admin status';
        }
      });
  }

  onActiveFilterChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.activeFilter = select.value;
    this.loadUsers();
  }
}