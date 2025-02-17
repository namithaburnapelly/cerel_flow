import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Transaction } from '../../Model/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent implements OnChanges {
  //holds the transaction if editing
  @Input() transactionToEdit: Transaction | null = null;
  //Emits the form data to another component
  @Output() formSubmitted = new EventEmitter<Transaction>();
  //checks if form is cancelled or not
  @Output() formCancelled = new EventEmitter<void>();

  //variable to check if it is edit function calling the component
  isEditmode: boolean = false;
  transactionForm: FormGroup;

  private fb = inject(FormBuilder);

  constructor() {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      amount: [, [Validators.required, Validators.min(1)]],
      description: [''],
      wallet: [''],
      screenshot: [null],
    });

    ////////////////////////
    this.isEditmode = !!this.transactionToEdit;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactionToEdit'] && this.transactionToEdit) {
      this.isEditmode = true; //switch to the edit mode
      this.transactionForm.patchValue(this.transactionToEdit); //add the values to form
    } else {
      this.isEditmode = false;
      this.transactionForm.reset();
    }
  }

  onSubmit() {
    //check if form is invalid
    if (this.transactionForm.invalid) {
      console.log('Invalid form submission');
      alert('Invalid form submission');
      return;
    }

    if (this.transactionForm.valid) {
      const data = this.transactionForm.value;

      if (this.isEditmode) {
        //emits an event containing the given value
        //sets the data to the form
        this.formSubmitted.emit({
          ...data,
          transactionId: this.transactionToEdit?.transactionId,
        });
      } else {
        this.formSubmitted.emit(data); //creates a new transaction
      }

      this.isEditmode = false;
      this.transactionForm.reset();
    } else {
      this.transactionForm.markAllAsTouched(); //shows all validation errors
    }
  }

  cancelTransaction(): void {
    this.formCancelled.emit();
  }
}
