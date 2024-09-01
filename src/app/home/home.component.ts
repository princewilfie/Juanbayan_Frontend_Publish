import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService, AlertService } from '@app/_services';

@Component({
  templateUrl: 'home.component.html'
})
export class HomeComponent implements OnInit {
  account = this.accountService.accountValue;


  constructor(
    private accountService: AccountService, 
    private router: Router, 
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }
}