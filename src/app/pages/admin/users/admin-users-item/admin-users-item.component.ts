// admin-users-item.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../models/user.model';

@Component({
  selector: '[app-admin-users-item]', // Note: Using attribute selector for tr
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users-item.component.html'
})
export class AdminUsersItemComponent {
  @Input() user!: User;
  @Output() edit = new EventEmitter<User>();
  @Output() delete = new EventEmitter<User>();
  @Output() toggleStatus = new EventEmitter<User>();
  @Output() toggleAdmin = new EventEmitter<User>();
}