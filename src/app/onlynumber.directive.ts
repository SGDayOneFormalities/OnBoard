import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[OnlyNumber]'
})
export class OnlyNumber {
    regexStr = '^[0-9 \-]*$';
    constructor(private el: ElementRef) { }
  
    @Input() OnlyNumber: boolean;
  
    @HostListener('keydown', ['$event']) onKeyDown(event) {
      let e = <KeyboardEvent> event;
      if (this.OnlyNumber) {     
        //ToDo check for dot 190, 110
        if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode == 65 && e.ctrlKey === true) ||
        // Allow: Ctrl+C
        (e.keyCode == 67 && e.ctrlKey === true) ||
        // Allow: Ctrl+V
        (e.keyCode == 86 && e.ctrlKey === true) ||
        // Allow: Ctrl+X
        (e.keyCode == 88 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode == 109 || e.keyCode == 189) ||
        //Allow: hyphen
        (e.keyCode == 32) ||
        //Allow: space
        (e.keyCode == 190 || e.keyCode==110) ||
        //Allow: Dot
        (e.keyCode >= 96 && e.keyCode <= 105)||
        //Alllow: numpad
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }else if((e.shiftKey === true && (e.keyCode >= 48 || e.keyCode <= 57))){ 
        //Stop Alha numeric keys         
          e.preventDefault();
        }
        let ch = String.fromCharCode(e.keyCode);
        let regEx =  new RegExp(this.regexStr);    
        if(regEx.test(ch))
          return;
        else
           e.preventDefault();
      }
    }
  }
  
//   constructor(private el: ElementRef) { }

//   @Input() OnlyNumber: boolean;

//   @HostListener('keydown', ['$event']) onKeyDown(event) {
//     let e = <KeyboardEvent> event;
//     if (this.OnlyNumber) {
//       if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
//         // Allow: Ctrl+A
//         (e.keyCode == 65 && e.ctrlKey === true) ||
//         // Allow: Ctrl+C
//         (e.keyCode == 67 && e.ctrlKey === true) ||
//         // Allow: Ctrl+X
//         (e.keyCode == 88 && e.ctrlKey === true) ||
//         // Allow: home, end, left, right
//         (e.keyCode >= 35 && e.keyCode <= 39)) {
//           // let it happen, don't do anything
//           return;
//         }
//         // Ensure that it is a number and stop the keypress
//         if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
//             e.preventDefault();
//         }
//       }
//   }



// import { Directive, ElementRef, HostListener, Input } from '@angular/core';
// import { NgControl } from '@angular/forms';

// @Directive({
//   selector: 'input[OnlyNumber]'
// })
// export class OnlyNumber {

//     constructor(private _el: ElementRef) { }

//     @HostListener('input', ['$event']) onInputChange(event) {
//       const initalValue = this._el.nativeElement.value;
//       this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
//       if ( initalValue !== this._el.nativeElement.value) {
//         event.stopPropagation();
//       }
//     }
// }
