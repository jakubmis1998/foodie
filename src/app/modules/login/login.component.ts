import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Emoji } from '../../models/emoji';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  Emoji = Emoji;
  iconNames = [
    'beer', 'champagne', 'chicken', 'drink', 'fries', 'hamburger', 'hotdog',
    'lobster', 'pasta', 'pizza-full', 'pizza-slice', 'prawn', 'steak'
  ];
  left: number[] = [];
  top: number[] = [];

  constructor(
    private authService: AuthService
  ) {
    this.calculateIconPositions();
  }

  firebaseLogin(): void {
    this.authService.login();
  }

  private calculateIconPositions(): void {
    for (let i=0; i<this.iconNames.length; i++) {
      this.left.push(i % 2 === 0 ? 60 + i*2.7 : 40 - i*3.2);
      this.top.push(5 + i*6.8);
    }
    const shuffleArray = (array: any[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    shuffleArray(this.iconNames);
    shuffleArray(this.left);
    shuffleArray(this.top);
  }
}
