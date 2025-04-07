import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,

  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  @Output() sortChanged = new EventEmitter<string>();

  selectedSort!: string;
  sortIcon: string = 'calendar-arrow-up';
  isAsc: boolean = false; //default order
  dropdown: boolean = false;

  private eref = inject(ElementRef);

  sortOptions = [
    {
      name: 'Date',
      key: 'date',
      iconAsc: 'calendar-arrow-up',
      iconDesc: 'calendar-arrow-down',
    },
    {
      name: 'Amount',
      key: 'amount',
      iconAsc: 'arrow-down-0-1',
      iconDesc: 'arrow-down-1-0',
    },
    {
      name: 'Recipient',
      key: 'recipient',
      iconAsc: 'arrow-down-a-z',
      iconDesc: 'arrow-down-z-a',
    },
  ];

  ngOnInit(): void {
    this.setSelectedSort('date');
  }

  toggleDropdown() {
    this.dropdown = !this.dropdown;
  }

  toggleSort() {
    this.isAsc = !this.isAsc;

    if (this.isAsc) {
      this.sortIcon =
        this.sortOptions.find((o) => o.key === this.selectedSort)?.iconAsc ||
        'asc';
    } else {
      this.sortIcon =
        this.sortOptions.find((o) => o.key === this.selectedSort)?.iconDesc ||
        'desc';
    }
    console.log(this.isAsc);

    const sortValue = `${this.selectedSort}_${this.isAsc ? 'asc' : 'desc'}`;
    this.sortChanged.emit(sortValue);
  }

  setSelectedSort(option: string) {
    this.selectedSort = option;
    this.isAsc = false;

    this.sortIcon =
      this.sortOptions.find((o) => o.key === this.selectedSort)?.iconDesc ||
      'desc';

    const sortValue = `${this.selectedSort}_${this.isAsc ? 'asc' : 'desc'}`;
    this.sortChanged.emit(sortValue);
  }

  getSelectedSortName(): string {
    return (
      this.sortOptions.find((o) => o.key === this.selectedSort)?.name ||
      'Filter'
    );
  }

  @HostListener('document: click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eref.nativeElement.contains(event.target)) this.dropdown = false;
  }
}
