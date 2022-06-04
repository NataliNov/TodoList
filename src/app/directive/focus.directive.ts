import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[setFocus]'
})
export class FocusDirective implements AfterViewInit {

  constructor(private hostElement: ElementRef) { }

  ngAfterViewInit() {
    this.hostElement.nativeElement.focus();
  }
}