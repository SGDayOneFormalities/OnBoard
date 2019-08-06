import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[letterOnly]'
})

export class LetterDirective {
    regexStr = '^[a-zA-Z \-]*$';
    constructor(private el: ElementRef) { }
  
    @Input() letterOnly: boolean;
  
    @HostListener('keydown', ['$event']) onKeyDown(event) {
      let e = <KeyboardEvent> event;
      if (this.letterOnly) {
        if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
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
        (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        else if((e.keyCode >= 96 && e.keyCode <= 107)){
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