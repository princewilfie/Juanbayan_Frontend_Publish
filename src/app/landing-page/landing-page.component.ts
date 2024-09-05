// landing-page.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit {

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    if (this.accountService.accountValue) {
      // Redirect to home if authenticated
      this.router.navigate(['/home']);
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/account/login']);
  }
}
