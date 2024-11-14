import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-switch',
  templateUrl: './dashboard-switch.component.html',
  styleUrls: ['./dashboard-switch.component.css']
})
export class DashboardSwitchComponent implements OnInit {

  constructor(
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  beneficiary()
  {
    this.router.navigate(['/beneficiary']);
  }

  donor()
  {
    this.router.navigate(['/donor']);
  }

  volunteer()
  {
    this.router.navigate(['/event-list']);
  }
}