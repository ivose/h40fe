import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/users.service';
import { User } from '../../../models/user2.model';
import { PageableParams } from '../../../models/pageable-params.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, PaginationComponent, RouterLink, FormatDatePipe],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  currentPage = 1;
  pageSize = 9;
  totalElements = 0;
  searchQuery = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      if (this.searchQuery) {
        this.searchUsers();
      } else {
        this.loadUsers();
      }
    });
  }

  loadUsers() {
    this.loading = true;
    const pageable = new PageableParams(this.currentPage - 1, this.pageSize);

    this.userService.getAllUsers(pageable).subscribe({
      next: (response) => {
        this.users = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.loading = false;
      }
    });
  }

  searchUsers() {
    this.loading = true;
    const pageable = new PageableParams(this.currentPage - 1, this.pageSize);

    this.userService.getAllUsers(pageable).subscribe({
      next: (response) => {
        // Filter users client-side if backend doesn't support search
        this.users = response.content.filter(user =>
          user.username.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.totalElements = this.users.length;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching users:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    if (this.searchQuery) {
      this.searchUsers();
    } else {
      this.loadUsers();
    }
  }
}