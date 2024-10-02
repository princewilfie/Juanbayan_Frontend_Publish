import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'; // Add FormsModule here
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout.component';
import { OverviewComponent } from './overview.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,  // Add FormsModule here
        ReactiveFormsModule,
        AdminRoutingModule,
        RouterModule, 
        IonicModule.forRoot()
    ],
    declarations: [
        LayoutComponent,
        OverviewComponent
    ]
})
export class AdminModule { }
