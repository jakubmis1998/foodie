import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent {

  @Input() small = false;
  @Input() color = 'primary';

  getColorClass(): string {
    switch (this.color) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'white':
        return 'text-white';
      default:
        return 'text-primary';
    }
  }
}
