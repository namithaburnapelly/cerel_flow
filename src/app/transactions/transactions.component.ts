import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  standalone: false,

  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  transfersVisibility!: boolean;
  transactionsVisibility!: boolean;

  ngOnInit(): void {
    // Retrieve the last selected view from localStorage
    const lastView = localStorage.getItem('lastView') || 'Transaction';

    // Set visibility based on last stored view
    this.view(lastView);
  }

  view(div: string) {
    if (div === 'Transfer') {
      this.transactionsVisibility = false;
      this.transfersVisibility = true;
    } else {
      this.transfersVisibility = false;
      this.transactionsVisibility = true;
    }

    // Store the last selected view in localStorage
    localStorage.setItem('lastView', div);
  }
}
