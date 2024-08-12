import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';

import { EventService, AlertService } from '@app/_services';
import { Event } from '@app/_models'; // Assuming Event model is defined in _models folder

@Component({ templateUrl: 'add-event.component.html' })
export class AddEventComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    isAddMode = true;
    selectedFile: File | null = null;
    events: Event[] = []; // Array to hold all events

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private eventService: EventService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            date: ['', Validators.required],
            location: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
            price: ['', Validators.required],
            image: ['']
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isAddMode = false;
                this.loadEvent(params['id']);
            }
        });

        // Load all events when component initializes
        this.loadAllEvents();
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    // Convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        this.alertService.clear();

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const formData = new FormData();
        formData.append('name', this.form.get('name')?.value);
        formData.append('date', this.form.get('date')?.value);
        formData.append('location', this.form.get('location')?.value);
        formData.append('description', this.form.get('description')?.value);
        formData.append('category', this.form.get('category')?.value);
        formData.append('price', this.form.get('price')?.value);
        if (this.selectedFile) {
            formData.append('image', this.selectedFile, this.selectedFile.name);
        }

        const request = this.isAddMode
            ? this.eventService.create(formData)
            : this.eventService.update(this.route.snapshot.params['id'], formData);

        request.pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Event saved successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/events']);
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private loadEvent(id: string) {
        this.eventService.getById(id)
            .pipe(first())
            .subscribe(event => {
                this.form.patchValue(event);
            });
    }

    private loadAllEvents() {
        this.eventService.getAllEvents()
            .pipe(first())
            .subscribe(events => {
                this.events = events;
            });
    }

    onCancel() {
        this.router.navigate(['/events']);
    }
}
