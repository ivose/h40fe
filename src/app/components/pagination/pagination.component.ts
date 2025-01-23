import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() page = 1;
  @Input() size = 10;
  @Input() count = 0;
  @Input() delta = 3;
  totalPages = 0;

  @Output() pageChange = new EventEmitter<number>();

  ngOnInit() {
    this.calculateTotalPages();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['count'] || changes['size']) {
      this.calculateTotalPages();
    }
  }

  private calculateTotalPages() {
    this.totalPages = Math.ceil(this.count / this.size);
  }

  getVisiblePages(): number[] {
    const delta = 3;
    const range: number[] = [];

    for (let i = this.page - this.delta; i <= this.page + this.delta; i++) {
      if (i >= 1 && i <= this.totalPages) {
        range.push(i);
      }
    }
    return range;
  }

  onPageChange(event: Event, newPage: number) {
    event.preventDefault();
    if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.page) {
      this.page = newPage;
      this.pageChange.emit(newPage);
    }
  }

}
