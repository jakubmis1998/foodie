import { Component, Input } from '@angular/core';
import { Emoji } from '../../../models/emoji';
import { Place } from '../../../models/place';
import { Router } from '@angular/router';
import { Food } from '../../../models/food';

@Component({
  selector: 'app-preview-item',
  templateUrl: './preview-item.component.html'
})
export class PreviewItemComponent {

  @Input() item: any;

  Emoji = Emoji;
  isFood = (item: Place | Food): item is Food => (item as any).placeId !== undefined;
  ago = (): { value: number; label: string } => {
    const timeDiff = Date.now() - (this.item.createdAt as any);
    const daysAgo = Math.round(timeDiff / (1000 * 3600 * 24));
    if (daysAgo > 0) {
      return { value: daysAgo, label: 'day(s)' };
    }
    const hoursAgo = Math.round(timeDiff / (1000 * 3600));
    if (hoursAgo > 0) {
      return { value: hoursAgo, label: 'hour(s)' };
    }
    return { value: Math.round(timeDiff / 1000), label: 'minute(s)' };
  };

  constructor(
    private router: Router
  ) {}

  goToDetails(place: Place): void {
    this.router.navigate([this.isFood(this.item) ? 'food-overview' : 'places-overview', place.id]).then(() => {});
  }
}
