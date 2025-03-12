import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'app-buttonoutput',
  templateUrl: './buttonoutput.component.html',
  styleUrls: ['./buttonoutput.component.scss'],
})
export class ButtonoutputComponent {
  @Output() removeImageEvent = new EventEmitter<number>();
  @Input() imageControls!: FormArray;
i: any;

  onRemoveImage(number: number): void {
    this.removeImageEvent.emit(number);
  }
}
