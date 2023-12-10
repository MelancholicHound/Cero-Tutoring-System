import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.scss']
})
export class LoginpageComponent implements OnInit {
  loginForm! : FormGroup;
  errorPrompt! : boolean;
  isExpanded! : boolean;
  constructor( private authService : AuthService, private router : Router) {  }
  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
  }
  createFormGroup() : FormGroup {
    return new FormGroup({
      email : new FormControl("", [Validators.required, Validators.email]),
      password : new FormControl("", [Validators.required, Validators.minLength(8)])
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      () => {
        this.router.navigate(["main"]);
      },
      (error) => {
        if (error.status) {
          this.errorPrompt = true;
          const invalidUsername = document.getElementById('email') as HTMLInputElement;
          invalidUsername.value = "";
          invalidUsername?.classList.add('is-invalid');
            const invalidPassword = document.getElementById('password') as HTMLInputElement;
          invalidPassword.value = "";
          invalidPassword?.classList.add('is-invalid');
        }
      }
      );
  }

   showPassword(): void {
    const password = document.getElementById('password') as HTMLInputElement;
    if (password.type === 'password') {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  }
}
