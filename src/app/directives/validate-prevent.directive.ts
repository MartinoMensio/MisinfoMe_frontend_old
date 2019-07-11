import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appValidatePrevent]'
})
export class ValidatePreventDirective {

  @Input()
  regex = '^[a-zA-Z0-9_]*$';

  @Input()
  unwanted_prefix = 'twitter.com/';

  @Input()
  isAlphaNumeric: boolean;

  constructor(private el: ElementRef) { }


  @HostListener('keypress', ['$event']) onKeyPress(event) {
    // test if the key is good
    const valid = new RegExp(this.regex).test(event.key);
    if (!valid) {
      console.log(`invalid char ${event.key}, preventing it`);
    }
    // a false return will block the character immission in the form field
    return valid;
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    const valid = new RegExp(this.regex).test(this.el.nativeElement);
    if (!valid) {
      // delay 0.2 secs the correction so we see what's going on
      setTimeout(() => {
        // get the value immitted
        let pasteData = this.el.nativeElement.value;
        // be sure to remove the prefix if the user is pasting the full URL
        if (pasteData.includes(this.unwanted_prefix)) {
          pasteData = pasteData.substring(pasteData.indexOf(this.unwanted_prefix) + this.unwanted_prefix.length);
        }
        // and then remove all the invalid characters
        pasteData = pasteData.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');

        // this clear+set is needed in order to have the filed validation work as expected
        this.el.nativeElement.value = '';
        // if we just set the nativeElement.value, the field will stay red
        document.execCommand('insertHTML', false, pasteData);
      }, 200);
    }
  }

}
