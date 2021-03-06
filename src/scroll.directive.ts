import { Directive, HostListener, Output, EventEmitter, Input } from '@angular/core';

export type ElementEvent = {target: {offsetHeight: number, scrollHeight: number, scrollTop: number}} ;
export type WindowEvent = {target: {body: {offsetHeight: number}}};
export type ScrollEvent = {originalEvent: WindowEvent | ElementEvent, isReachingBottom: boolean, isWindowEvent: boolean}

declare const window: {pageYOffset: number, innerHeight: number};

@Directive({
  selector: '[detect-scroll]'
})
export class ScrollDirective {
  @Output() public onScroll = new EventEmitter<ScrollEvent>();
  @Input() public bottomOffest: number = 100;

  constructor() { }

  // handle host scroll
  @HostListener('scroll', ['$event']) public scrolled($event: ElementEvent) {
    this.elementScrollEvent($event);
  }

  // handle window scroll
  @HostListener('window:scroll', ['$event']) public windowScrolled($event: WindowEvent) {
    this.windowScrollEvent($event);
  }

  protected windowScrollEvent($event: WindowEvent) {
    const target = $event.target;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const isReachingBottom = ( target.body.offsetHeight - (window.innerHeight + scrollTop) ) < this.bottomOffest;
    const emitValue: ScrollEvent = {isReachingBottom, originalEvent: $event, isWindowEvent: true};
    this.onScroll.emit(emitValue);
  }

  protected elementScrollEvent($event: ElementEvent) {
    const target = $event.target;
    const scrollPosition = target.scrollHeight - target.scrollTop;
    const offsetHeight = target.offsetHeight;
    const isReachingBottom = (scrollPosition - offsetHeight) < this.bottomOffest;
    const emitValue: ScrollEvent = {isReachingBottom, originalEvent: $event, isWindowEvent: false};
    this.onScroll.emit(emitValue);
  }

}
