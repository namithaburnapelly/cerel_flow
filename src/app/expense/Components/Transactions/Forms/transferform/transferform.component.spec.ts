import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferformComponent } from './transferform.component';

describe('TransferformComponent', () => {
  let component: TransferformComponent;
  let fixture: ComponentFixture<TransferformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
