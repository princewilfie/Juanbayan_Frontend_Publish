import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventListComponent } from './event-list.component';
import { AddEventComponent } from './add-event.component';

const routes: Routes = [
    { path: '', component: EventListComponent },
    { path: 'add', component: AddEventComponent },
    { path: 'edit/:id', component: AddEventComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventsRoutingModule { }