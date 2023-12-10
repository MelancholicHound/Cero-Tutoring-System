import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit{
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  passwordForm!: FormGroup;
  errorPrompt!: boolean;

  constructor(private authService : AuthService , private router : Router) {}
  ngOnInit(): void {
    const submitEmail = document.getElementById('submit-request') as HTMLButtonElement;
    const submitPassword = document.getElementById('submit-password') as HTMLButtonElement;
    this.emailForm = this.recover();
    this.otpForm = this.otpFormGroup();
    this.passwordForm = this.newPassword();

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

    this.passwordForm.get('password')?.valueChanges.subscribe(() => {
      const successPrompt = document.querySelector('.success-prompt') as HTMLDivElement;
      successPrompt.style.display = 'none';
    });
    this.passwordForm.get('confirm-password')?.valueChanges.subscribe(() => {
      const successPrompt = document.querySelector('.success-prompt') as HTMLDivElement;
      successPrompt.style.display = 'none';
    });

    submitEmail.addEventListener('click', () => {
      this.authService.recover(this.emailForm.value.email).subscribe(
        () => {
          this.errorPrompt = false;
        },
        (error) => {
          if (error.status) {
            const buttonClose = document.querySelector('.btn-close') as HTMLButtonElement;
            buttonClose.click();
            this.errorPrompt = true;
            const invalidEmail = document.getElementById('email') as HTMLInputElement;
            invalidEmail.value = "";
            invalidEmail?.classList.add('is-invalid');
          }
        });
        const submitOTP = document.getElementById('submit-button') as HTMLButtonElement;
        submitOTP.addEventListener('click', () => {
          const email = this.emailForm.get('email')?.value;
          const otp1 = this.otpForm.get('otp1')?.value;
          const otp2 = this.otpForm.get('otp2')?.value;
          const otp3 = this.otpForm.get('otp3')?.value;
          const otp4 = this.otpForm.get('otp4')?.value;
          const otp = `${otp1}` + `${otp2}` + `${otp3}` + `${otp4}`;
          const successPrompt = document.querySelector('p.success') as HTMLElement;
          this.authService.verifyotp(email, otp).subscribe(
            () => {
              successPrompt.textContent = 'Success! You may proceed to changing your password';
              setTimeout(() => {
              const close = document.querySelector('button.btn-close') as HTMLButtonElement;
              close.click();
              const submit = document.querySelector('.submit-button') as HTMLElement;
              const newPass = document.querySelector('.reset-password') as HTMLElement;
              const emailField = document.querySelector('.provide-email') as HTMLElement;
              const passwordFiled = document.querySelector('.new-password') as HTMLElement;
              submit.style.display = 'none';
              emailField.style.display = 'none';
              newPass.style.display = 'flex';
              passwordFiled.style.display = 'block';
              }, 1500);
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
            });
        });
    });
    submitPassword.addEventListener('click', () => {
      const passwordOne = this.passwordForm.get('password')?.value;
      const passwordTwo = this.passwordForm.get('confirm_password')?.value;
      const email = this.emailForm.get('email')?.value;
      if(passwordOne === passwordTwo) {
        this.authService.changePassword(passwordOne, email).subscribe(
          () => {
            const successPrompt = document.querySelector('.success-prompt') as HTMLDivElement;
            successPrompt.style.display = 'block';
            successPrompt.style.color = '#198754';
            setTimeout(() => {
              this.router.navigate(['login']);
            }, 2000);
          }
        )
      } else {
        console.log('hello')
        const password = document.getElementById('password') as HTMLInputElement;
        const confirm = document.getElementById('password-confirm') as HTMLInputElement;
        password.value = "";
        password?.classList.add('is-invalid');
        confirm.value = "";
        confirm?.classList.add('is-invalid');
        const successPrompt = document.querySelector('.success-prompt') as HTMLDivElement;
        successPrompt.style.display = 'block';
        successPrompt.style.color = '#dc3545';
        successPrompt.textContent = "Password doesn't match. Try again."
      }
    });
  }
  recover(): FormGroup {
    return new FormGroup({ email: new FormControl("", [Validators.required, Validators.email]) });
  }
  otpFormGroup(): FormGroup {
    return new FormGroup({
      otp1: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      otp2: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      otp3: new FormControl("", [Validators.required, Validators.maxLength(1)]),
      otp4: new FormControl("", [Validators.required, Validators.maxLength(1)]),
    });
  }
  newPassword(): FormGroup {
    return new FormGroup({
      password: new FormControl("", [Validators.required]),
      confirm_password: new FormControl("", [Validators.required]),
    });
  }
}
