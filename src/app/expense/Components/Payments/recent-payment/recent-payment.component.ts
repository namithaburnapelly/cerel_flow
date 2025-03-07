import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recent-payment',
  standalone: false,

  templateUrl: './recent-payment.component.html',
  styleUrl: './recent-payment.component.css',
})
export class RecentPaymentComponent implements OnInit {
  transferFormVisibility: boolean = false;
  transactionFormVisibility: boolean = true;

  ngOnInit(): void {
    // Retrieve the last selected view from localStorage
    const latestForm = localStorage.getItem('latestForm') || 'Transaction';

    // Set visibility based on last stored view
    this.formSelected(latestForm);
  }

  formSelected(form: string) {
    if (form === 'Transfer') {
      this.transactionFormVisibility = false;
      this.transferFormVisibility = true;
    } else {
      this.transferFormVisibility = false;
      this.transactionFormVisibility = true;
    }

    // Store the last selected view in localStorage
    localStorage.setItem('latestForm', form);
  }
}
