import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { interval } from 'rxjs';

import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.scss']
})
export class SignuppageComponent implements OnInit {
  signupForm! : FormGroup;
  errorPrompt! : boolean;
  otpForm! : FormGroup;
  interval$: any;
  counter: number = 60;

  constructor(private authService : AuthService, private router : Router) {}
  ngOnInit(): void {
    const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
    this.signupForm = this.createFormGroup()
    this.otpForm = this.otpFormGroup();

    this.otpForm.get('otp1')?.valueChanges.subscribe(() => {
      const digit = document.getElementById('digit2') as HTMLInputElement;
      digit.focus();
    });
    this.otpForm.get('otp2')?.valueChanges.subscribe(() => {
      const digit = document.getElementById('digit3') as HTMLInputElement;
      digit.focus();
    });
    this.otpForm.get('otp3')?.valueChanges.subscribe(() => {
      const digit = document.getElementById('digit4') as HTMLInputElement;
      digit.focus();
    });

    submitButton.addEventListener('click', () => {
      const successPrompt = document.querySelector('.success') as HTMLElement;
      const email = this.signupForm.get('email')?.value;
      const otp1 = this.otpForm.get('otp1')?.value;
      const otp2 = this.otpForm.get('otp2')?.value;
      const otp3 = this.otpForm.get('otp3')?.value;
      const otp4 = this.otpForm.get('otp4')?.value;
      const otp = `${otp1}` + `${otp2}` + `${otp3}` + `${otp4}`;
      this.authService.verifyotp(email, otp).subscribe(
        () => {
          successPrompt.textContent = 'Success!';
          setTimeout(() => {
            const close = document.querySelector('button.btn-close') as HTMLButtonElement;
            close.click();
            this.router.navigate(['login']);
          }, 1000);
        },
        (error) => {
          if(error.status) {
            successPrompt.textContent = 'An error occured. Please insert the correct pin';
            const digitOne = document.getElementById('digit1') as HTMLInputElement;
            const digitTwo = document.getElementById('digit2') as HTMLInputElement;
            const digitThree = document.getElementById('digit3') as HTMLInputElement;
            const digitFour = document.getElementById('digit4') as HTMLInputElement;
            digitOne.value = '';
            digitTwo.value = '';
            digitThree.value = '';
            digitFour.value = '';
          }
        }
      );
    });
}

  createFormGroup(): FormGroup {
    return new FormGroup({
      firstname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      middlename: new FormControl("", [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl("", [Validators.required, Validators.minLength(2)]),
      gender: new FormControl("", [Validators.required]),
      birthdate: new FormControl("", [Validators.required]),
      age: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      username: new FormControl("", [Validators.required, Validators.minLength(5)]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      checkboxControl : new FormControl(false, Validators.requiredTrue)
    });
  }

  otpFormGroup(): FormGroup {
    return new FormGroup({
      otp1: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      otp2: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      otp3: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      otp4: new FormControl("", [Validators.required, Validators.maxLength(1)]),
    });
  }

  signup(): void {
    this.authService.signup(this.signupForm.value).subscribe();
  }

  showPassword(): void {
    const password = document.getElementById('password') as HTMLInputElement;
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }

  calculateAge(): void {
    const dobInput = document.getElementById('dob') as HTMLInputElement;

    const dob = new Date(dobInput.value);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
      age--;
    }
    const ageControl = this.signupForm.get('age');
    ageControl?.setValue(age);

    ageControl?.updateValueAndValidity();
  }

  isFormValid() {
    return this.signupForm.valid;
  }

  originalState = {
    disabled: false,
    innerHTML: 'Resend'
  }
  startCounter() {
    const resendButton = document.getElementById('resend-otp') as HTMLButtonElement;
    this.interval$ = interval(1000)
      .subscribe(val => {this.counter--;});
      if (this.counter === 0) {
        this.counter = 60;
      }
    setTimeout(() => {
      resendButton.disabled = false;
      resendButton.innerHTML = 'Resend';
      this.interval$.unsubscribe();
    }, 60000);
  }
  stopCounter() {
    this.counter = 0;
    this.interval$.unsubscribe();
  }
}
