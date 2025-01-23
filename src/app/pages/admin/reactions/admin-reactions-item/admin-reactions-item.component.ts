import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionCategory } from '../../../../models/reaction-category.model';

@Component({
  selector: '[app-admin-reactions-item]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reactions-item.component.html',
  styleUrls: ['./admin-reactions-item.component.scss']
})
export class AdminReactionsItemComponent {
  @Input() category!: ReactionCategory;
  @Output() edit = new EventEmitter<ReactionCategory>();
  @Output() delete = new EventEmitter<ReactionCategory>();
}