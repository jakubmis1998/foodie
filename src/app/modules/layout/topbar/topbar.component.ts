import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Emoji, getEmoji } from '../../../models/emoji';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  Emoji = Emoji;

  constructor(
    public authService: AuthService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.toastrService.info(
      'You have been logged in successfully',
      `Hello ${getEmoji(Emoji.wave)}`
    );
  }

  logout(): void {
    this.authService.logout();
    this.toastrService.info(
      'Have a nice day!',
      `Goodbye ${getEmoji(Emoji.wave)}`
    );
  }
}
