// admin-users-form.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-admin-users-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users-form.component.html'
})
export class AdminUsersFormComponent {
  @Input() user: any = {};
  @Input() editMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  userModel: any = {};

  ngOnInit() {
    if (this.editMode && this.user) {
      this.userModel = {
        email: this.user.email,
        username: this.user.username,
        fullname: this.user.fullName || this.user.fullname, // Handle both cases
        born: new Date(this.user.born).toISOString().split('T')[0]
      };
    } else {
      this.userModel = {
        email: '',
        username: '',
        password: '',
        fullname: '', // Use fullname instead of fullName
        born: ''
      };
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.save.emit(this.userModel);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}