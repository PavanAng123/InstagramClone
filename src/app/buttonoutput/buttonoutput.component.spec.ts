import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonoutputComponent } from './buttonoutput.component';

describe('ButtonoutputComponent', () => {
  let component: ButtonoutputComponent;
  let fixture: ComponentFixture<ButtonoutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonoutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonoutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
