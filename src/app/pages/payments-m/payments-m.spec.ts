import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentsM } from './payments-m';

describe('PaymentsM', () => {
  let component: PaymentsM;
  let fixture: ComponentFixture<PaymentsM>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsM],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsM);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
