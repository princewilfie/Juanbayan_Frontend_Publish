import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../_services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if the user is not logged in
    if (!this.accountService.accountValue) {
      // Redirect to the login page if not logged in
      this.router.navigate(['/landingpage/landing-page']);
    }
  }
}
