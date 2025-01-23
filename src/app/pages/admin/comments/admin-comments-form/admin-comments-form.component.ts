// src/app/pages/admin/comments/admin-comments-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Comment } from '../../../../models/comment.model';

@Component({
  selector: 'app-admin-comments-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-comments-form.component.html',
})
export class AdminCommentsFormComponent implements OnInit {
  @Input() comment: Comment | null = null;
  @Output() save = new EventEmitter<{ content: string }>();
  @Output() cancel = new EventEmitter<void>();

  content = '';

  ngOnInit() {
    if (this.comment) {
      this.content = this.comment.content;
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.save.emit({ content: this.content });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}