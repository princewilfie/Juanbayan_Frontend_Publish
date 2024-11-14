import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AccountService } from './_services';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  // Import NgbModule for Bootstrap components
import { FullCalendarModule } from '@fullcalendar/angular';


import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { LandingPageComponent } from './landing-page'; // Correct path
import { TeamMemberComponent } from './team-member/about-us.component';
import { CampaignComponent } from './campaign/campaign.component';
import { AdminModule } from './admin/admin.module';
import { CreateCampaignComponent } from './create campaign';
import { RouterModule } from '@angular/router';
import { CampaignDetailsComponent } from './campaign/campaign-details.component';
import { EventDetailsComponent } from './event-list/event-details.component';
import { TermsAndConditionsModalComponent } from './event-list/event-terms-condition.component';
import { EventListComponent } from './event-list/event-list.component';
import { CreateEventComponent } from './events/create-event.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContactUsComponent } from './contact/contact.component';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule, 
        AdminModule,
        RouterModule,
        CommonModule,
        FullCalendarModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        LandingPageComponent,
        TeamMemberComponent,
        CampaignComponent, 
        CreateCampaignComponent,
        CampaignDetailsComponent,
        CreateEventComponent,
        EventListComponent,
        EventDetailsComponent,
        TermsAndConditionsModalComponent,
        ContactUsComponent
    ],
    providers: [
        { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AccountService] },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        // fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }