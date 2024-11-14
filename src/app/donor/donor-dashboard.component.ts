import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent implements OnInit {
  user = 'User';
  featuredCampaign = {
    title: "Donate For Jenny's Treatment and Medicine",
    description: "Help Jenny receive the medical treatment she urgently needs to recover and regain her health.",
    category: "Medical",
    startDate: "January 1, 2024",
    endDate: "March 31, 2024",
    imageUrl: "https://via.placeholder.com/500x300"
  };
  campaigns = [
    {
      title: "Children You Work With",
      description: "Help provide shelter and food for homeless children in our community.",
      category: "Homeless",
      startDate: "January 1, 2024",
      endDate: "March 31, 2024",
      raised: 6500,
      goal: 10000,
      progress: 65,
      imageUrl: "https://via.placeholder.com/500x300"
    },
    {
      title: "Help For Education",
      description: "Support children in need by providing access to educational resources.",
      category: "Education",
      startDate: "January 1, 2024",
      endDate: "March 31, 2024",
      raised: 3000,
      goal: 10000,
      progress: 30,
      imageUrl: "https://via.placeholder.com/500x300"
    }
  ];
  testimonials = [
    { name: "Belli Smith", role: "Designer", message: "Contribute to a cause, knowing your help will make a difference.", imageUrl: "https://via.placeholder.com/60" },
    { name: "Sara Taylor", role: "Donor", message: "This platform bridges the gap between those in need and willing donors.", imageUrl: "https://via.placeholder.com/60" },
    { name: "John Doe", role: "Volunteer", message: "Volunteering here has given me purpose and a chance to help my community.", imageUrl: "https://via.placeholder.com/60" },
    { name: "Mary Johnson", role: "Beneficiary", message: "I am grateful for the support I received when I needed it the most.", imageUrl: "https://via.placeholder.com/60" }
  ];

  constructor() {}

  ngOnInit(): void {}

  
}