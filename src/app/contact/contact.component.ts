// contact-us.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact.component.html'
})
export class ContactUsComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form with form controls
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  // Method to handle form submission
  onSubmit() {
    if (this.contactForm.valid) {
      // Process form submission
      console.log(this.contactForm.value);
      alert('Message sent successfully!');
    } else {
      alert('Please fill in all fields.');
    }
  }
}