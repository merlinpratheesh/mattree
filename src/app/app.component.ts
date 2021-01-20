import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { UserdataService, userProfile,usrinfo, projectFlags, usrinfoDetails,projectControls } from './service/userdata.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'one-tap';
  $user: any;
  constructor(
    public authService: AuthService,
    public developmentservice: UserdataService,

  ) { }
  ngOnInit(): void {
    this.$user = this.authService.user;
    console.log(this.$user);
    console.log(AuthService);


  }

  signOut(): void {
    this.authService.signOut();
  }
  
}
