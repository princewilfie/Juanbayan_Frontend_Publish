import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService, AlertService } from '@app/_services';
import { MustMatch } from '@app/_helpers'; // Custom Validator to ensure passwords match

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
})
export class LoginRegisterComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  submitted = false;
  isRightPanelActive = false; // For toggling between SignIn and SignUp
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private accountService: AccountService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
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
      acc_acceptTerms: [false, Validators.requiredTrue]
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
    this.alertService.clear();

    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.accountService.login(this.lf.acc_email.value, this.lf.acc_passwordHash.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: error => {
              console.error('Login error:', error); // Log the error to the console for debugging
              const errorMessage = error?.error?.message || 'Login failed. Please check your credentials.';
              this.alertService.error(errorMessage);
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
          this.alertService.success('Registration successful, please check your email for verification instructions', { keepAfterRouteChange: true });
          this.router.navigate(['/login-register']);
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }
}