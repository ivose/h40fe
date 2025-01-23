// src/app/pages/admin/posts/admin-posts-form/admin-posts-form.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../../models/post.model';

@Component({
  selector: 'app-admin-posts-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-posts-form.component.html'
})
export class AdminPostsFormComponent implements OnInit {
  @Input() post: Post | null = null;
  @Input() editMode = false;
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  postModel: any = {};

  ngOnInit() {
    if (this.editMode && this.post) {
      this.postModel = {
        title: this.post.title,
        content: this.post.content
      };
    } else {
      this.postModel = {
        title: '',
        content: ''
      };
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.save.emit(this.postModel);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}