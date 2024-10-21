import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';

// Lazy load the AccountsModule and CampaignsModule
const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const campaignsModule = () => import('./campaign/campaign.module').then(x => x.CampaignModule);
const rewardsModule = ()  => import('./rewards/rewards.module').then(x => x.RewardModule);
const eventsModule = ()  => import('./events/event.module').then(x => x.EventModule);
const withdrawModule = ()  => import('./withdraw/withdraw.module').then(x  => x.WithdrawModule);
const reportModule = ()  => import('./reports/reports.module').then(x  => x.ReportsModule);

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: OverviewComponent },
            { path: 'accounts', loadChildren: accountsModule },
            { path: 'campaigns', loadChildren: campaignsModule }, 
            { path: 'rewards', loadChildren: rewardsModule },
            { path: 'events', loadChildren: eventsModule }, 
            { path: 'withdraw', loadChildren: withdrawModule }, 
            { path: 'reports', loadChildren: reportModule }, 

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
