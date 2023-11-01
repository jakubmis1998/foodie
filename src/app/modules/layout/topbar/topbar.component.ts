import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Emoji, getEmoji } from '../../../models/emoji';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './components/navigation/navigation.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  Emoji = Emoji;

  constructor(
    public authService: AuthService,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.toastrService.info(
      'You have been logged in successfully',
      `Hello ${getEmoji(Emoji.wave)}`
    );
  }

  openNavigation(): void {
    this.modalService.open(NavigationComponent, { centered: true });
  }

  logout(): void {
    this.authService.logout();
    this.toastrService.info(
      'Have a nice day!',
      `Goodbye ${getEmoji(Emoji.wave)}`
    );
  }
}
