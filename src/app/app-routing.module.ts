import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';
import { Role } from './_models';

// router
import { LandingPageComponent } from './landing-page/landing-page.component';
import { TeamMemberComponent } from './team-member/about-us.component';
import { CampaignComponent } from './campaign/campaign.component';
import { CreateCampaignComponent } from './create campaign/create-campaign.component'
import { NotFoundComponent } from './lost-page/404.page.component';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const adminModule = () => import('./admin/admin.module').then(x => x.AdminModule);
const profileModule = () => import('./profile/profile.module').then(x => x.ProfileModule);

const routes: Routes = [
    { path: '', redirectTo: '/landing-page', pathMatch: 'full' }, // Redirect root to landing-page
    { path: 'landing-page', component: LandingPageComponent },  // Public route
    { path: 'team-member', component: TeamMemberComponent },  // Add route for About Us
    { path: 'campaign', component: CampaignComponent},
    { path: 'create-campaign', component: CreateCampaignComponent }, // Route for creating a campaign

    // Protected route with AuthGuard for home
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

    // Lazy-loaded account module, login-register doesn't need AuthGuard
    { path: 'account', loadChildren: accountModule },

    // Protected profile routes, only for authenticated users
    { path: 'profile', loadChildren: profileModule, canActivate: [AuthGuard] },

    // Admin routes, restricted by role using the data property
    { path: 'admin', loadChildren: adminModule, canActivate: [AuthGuard], data: { roles: [Role.Admin] } },

    // Catch-all redirect for invalid routes
    { path: '**', redirectTo: '/landing-page', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
