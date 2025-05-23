import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers'; 
import { Role } from '../_models';
import Swal from 'sweetalert2'; 
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css', './login-register.component.scss', './login-register.component.less'],
})
export class LoginRegisterComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted = false;
  isRightPanelActive = false; // For toggling between SignIn and SignUp
  loading = false;
  step: number = 1;
  hasExistingAccounts: boolean = true; // Default to true; update based on API call.
  termsModalOpen: boolean = false; // For terms modal

  nextStep() {
    if (this.step < 3) {
        this.step++;
    }
}

previousStep() {
    if (this.step > 1) {
        this.step--;
    }
}

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {


    // Check if there are existing accounts
    this.accountService.getAll().subscribe({
      next: (accounts) => {
          this.hasExistingAccounts = accounts.length > 0;
          if (!this.hasExistingAccounts) {
              // Auto-set acc_type to Admin and skip Step 1
              this.registerForm.patchValue({ acc_type: 'Admin' });
              console.log('Auto-set acc_type to Admin: ', this.registerForm.value.acc_type);
              this.step = 2; // Skip Step 1
          }
      },
      error: (err) => {
          console.error('Error fetching accounts', err);
      }
  });

    // Handle Google OAuth redirect token
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        // Save the token in local storage
        localStorage.setItem('authToken', token);
        // Redirect to the home page or another appropriate page
        this.router.navigate(['/home']);
      }
    });

    // Login form
    this.loginForm = this.formBuilder.group({
      acc_email: ['', [Validators.required, Validators.email]],
      acc_passwordHash: ['', Validators.required]
    });

    // Register form
    this.registerForm = this.formBuilder.group({
      acc_firstname: ['', Validators.required],
      acc_lastname: ['', Validators.required],
      acc_email: ['', [Validators.required, Validators.email]],
      acc_pnumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,12}$')]],
      acc_passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acc_acceptTerms: [false, Validators.requiredTrue],
      acc_type: ['', Validators.required], // Add acc_type here
    }, {
      validator: MustMatch('acc_passwordHash', 'confirmPassword')
    });
  }

  // Toggle panel to show Sign Up form
  toggleToSignUp() {
    this.isRightPanelActive = true;
  }

  // Toggle panel to show Sign In form
  toggleToSignIn() {
    this.isRightPanelActive = false;
  }

  // Getter for login form fields
  get lf() { return this.loginForm.controls; }

  // Getter for register form fields
  get rf() { return this.registerForm.controls; }

  // Login form submission
  onLoginSubmit() {
    this.submitted = true;
    this.alertService.clear(); // Clear any existing alerts

    // If the form is invalid, stop here
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true; // Start the loading spinner or state

    // Call the login function from accountService
    this.accountService.login(this.lf.acc_email.value, this.lf.acc_passwordHash.value)
        .pipe(first())
        .subscribe({
            next: (user: any) => {
                const account = this.accountService.accountValue.acc_role;
                const userRole = user?.acc_role || account; // Assuming 'role' is the key for roles in the API response

                if (userRole === Role.User) {
                    // Navigate to the user dashboard-switcher
                    if(user.acc_type === 'Donor') {
                      this.router.navigate(['/donor']);
                    } else if (user.acc_type === 'Beneficiary') {
                      this.router.navigate(['/beneficiary']);
                    }

                } else if (userRole === Role.Admin) {
                    // For admins or other roles, route accordingly
                    this.router.navigate(['/admin']); // Example for admins
                } else {
                    // Show SweetAlert error for invalid credentials
                    Swal.fire({
                      icon: 'warning',
                      title: 'Login Failed',
                      text: 'Invalid account credentials. Please try again.',
                      confirmButtonText: 'OK'
                    });
                    this.loading = false;
                    this.submitted = false; // Allow resubmission on error
                }
            },
            error: (error: any) => {
          
              const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred.';
              // Display SweetAlert with the error message
              Swal.fire({
                  icon: 'error',
                  title: 'Login Failed',
                  text: errorMessage, // Directly show the string error
                  confirmButtonText: 'OK',
              });
          
              this.loading = false;
          }         
      });
  }

  // Register form submission
  onRegisterSubmit() {
    this.submitted = true;
    this.alertService.clear();

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    const registrationPayload = {
      ...this.registerForm.value,
      acc_totalpoints: 0 // Set default value for new registrations
    };

    this.accountService.register(registrationPayload)
      .pipe(first())
      .subscribe({
        next: () => {
          // SweetAlert for successful registration
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Registration successful! Please check your email for verification instructions.',
            confirmButtonText: 'OK'
          });
          this.router.navigate(['/login-register']);
        },
        error: (error: any) => {
          
          const errorMessage = typeof error === 'string' ? error : 'An unexpected error occurred.';
          // Display SweetAlert with the error message
          Swal.fire({
              icon: 'error',
              title: 'Registration Failed',
              text: errorMessage, // Directly show the string error
              confirmButtonText: 'OK',
          });
          this.loading = false;
          this.submitted = false;
        }
      });
  }
   // Modal for Terms
   openTermsModal(event: Event): void {
    event.preventDefault(); // Prevent default checkbox toggle on click
    this.termsModalOpen = true;
  }

  closeTermsModal(): void {
    this.termsModalOpen = false;
  }

  acceptTerms(): void {
    this.closeTermsModal();
    const termsCheckbox = document.getElementById('acceptTerms') as HTMLInputElement;
    if (termsCheckbox) {
      termsCheckbox.checked = true;
      this.registerForm.patchValue({ acc_acceptTerms: true }); // Sync with form
    }
  }
}