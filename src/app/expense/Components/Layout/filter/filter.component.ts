import { Component } from '@angular/core';

@Component({
  selector: 'app-filter',
  standalone: false,

  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  dropdown: boolean = false;
  sort_options = ['Date', 'Amount', 'Recipient'];
  sort_option_icons = [
    'calendar-arrow-down',
    'calendar-arrow-up',
    'arrow-down-1-0',
    'arrow-down-0-1',
    'arrow-down-a-z',
    'arrow-down-z-a',
  ];
  // sort_options = [
  //   { name: 'Date', icon: 'calendar-arrow-down' },
  //   { name: 'Date', icon: 'calendar-arrow-up' },
  //   { name: 'Date', icon: 'arrow-down-1-0' },
  //   { name: 'Date', icon: 'arrow-down-0-1' },
  //   { name: 'Date', icon: 'arrow-down-a-z' },
  //   { name: 'Date', icon: 'arrow-down-z-a' },
  // ];

  filterOptions() {
    this.dropdown = !this.dropdown;
  }
}
