import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputandoutputComponent } from './inputandoutput.component';

describe('InputandoutputComponent', () => {
  let component: InputandoutputComponent;
  let fixture: ComponentFixture<InputandoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputandoutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputandoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
