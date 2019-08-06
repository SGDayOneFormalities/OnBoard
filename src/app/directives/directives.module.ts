import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumber } from '../onlynumber.directive';
import { LetterDirective } from '../onlyletter.directive';
// import { DatepickerComponent } from '../custom-datepicker/datepicker.component';

@NgModule({
  declarations: [OnlyNumber, LetterDirective],
  exports: [OnlyNumber, LetterDirective],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
