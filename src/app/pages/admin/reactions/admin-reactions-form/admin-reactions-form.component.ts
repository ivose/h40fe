import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactionCategory } from '../../../../models/reaction-category.model';

@Component({
  selector: 'app-admin-reactions-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reactions-form.component.html',
  styleUrls: ['./admin-reactions-form.component.scss']
})
export class AdminReactionsFormComponent implements OnInit {
  @Input() category: ReactionCategory | null = null;
  @Output() save = new EventEmitter<{ name: string; icon: string }>();
  @Output() cancel = new EventEmitter<void>();

  name = '';
  icon = '';

  ngOnInit() {
    if (this.category) {
      this.name = this.category.name;
      this.icon = this.category.icon;
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      this.save.emit({
        name: this.name.trim(),
        icon: this.icon.trim()
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}