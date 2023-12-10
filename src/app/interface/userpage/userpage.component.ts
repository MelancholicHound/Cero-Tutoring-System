import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss']
})
export class UserpageComponent implements OnInit {
  updateForm! : FormGroup;

  firstname : any;
  middlename : any;
  lastname : any ;
  gender : any;
  age : any;
  birthday : any
  email : any;
  username : any;
  password : any;

  lessonProgress: any;

  animationActive = false;
  constructor ( private authService : AuthService, private router: Router ) {}
  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenPayload = token.split(".")[1];
      const decodedPayload = atob(tokenPayload);
      const payloadData = JSON.parse(decodedPayload);
      this.firstname = payloadData.firstname;
      this.middlename = payloadData.middlename;
      this.lastname = payloadData.lastname;
      this.gender = payloadData.gender;
      this.age = payloadData.age;
      this.email = payloadData.email;
      this.username = payloadData.username;
      this.lessonProgress = payloadData.lesson;
      let payloadBirthday = payloadData.birthdate;
      let retrievedBirthday = new Date(payloadBirthday);
      retrievedBirthday.setDate(retrievedBirthday.getDate() + 1);
      this.birthday = retrievedBirthday.toISOString().split('T')[0];
    }

    let form = new FormGroup({
      firstname: new FormControl(`${this.firstname}`, [Validators.required, Validators.minLength(2)]),
      middlename: new FormControl(`${this.middlename}`, [Validators.required, Validators.minLength(2)]),
      lastname: new FormControl(`${this.lastname}`, [Validators.required, Validators.minLength(2)]),
      gender: new FormControl(`${this.gender}`, [Validators.required]),
      birthdate: new FormControl(`${this.birthday}`, [Validators.required]),
      age: new FormControl(`${this.age}`, [Validators.required]),
      email: new FormControl(`${this.email}`, [Validators.required, Validators.email]),
      username: new FormControl(`${this.username}`, [Validators.required, Validators.minLength(5)])
    });

    this.updateForm = form;

    const expandButton = document.querySelector('.view') as HTMLButtonElement;
    const discardButton = document.getElementById('discard-changes') as HTMLButtonElement;
    const exitButton = document.querySelector('.signout') as HTMLButtonElement;
    const formElement = document.querySelector('form.update') as HTMLElement;
    const content = document.querySelector('.content') as HTMLFormElement;
    const progressBar = document.querySelector('.progress-bar') as HTMLElement;
    progressBar.style.width = `${this.lessonProgress}%`

    const viewButton = document.querySelector('.view-button') as HTMLButtonElement;
    const signoutButton = document.querySelector('.signout-button') as HTMLButtonElement;
    const saveButton = document.createElement('button');
    const discardBtn = document.createElement('button');

        saveButton.textContent = 'Save & Exit';
        saveButton.style.height = '4.5vh';
        saveButton.style.fontWeight = 'bolder';
        saveButton.style.border = '1px solid #112a40';
        saveButton.style.borderRadius = '30px';
        saveButton.style.width = '30vw';
        saveButton.style.color = '#195b8b';
        saveButton.type = 'submit';
        saveButton.setAttribute('data-bs-toggle', 'modal');
        saveButton.setAttribute('data-bs-target', '#redirectLogin');


        saveButton.addEventListener('click', () => {
          this.authService.update(this.updateForm.value).subscribe();
          formElement.classList.add('animateBackwards');
          formElement.classList.remove('animateForwards');

          content.style.display = 'none';

          viewButton.replaceChild(expandButton, saveButton);
          signoutButton.replaceChild(exitButton, discardBtn);
          const loginNav = document.getElementById('redirect') as HTMLButtonElement;
          loginNav.addEventListener('click', () => {
            this.signOut();
          });
        });

        discardBtn.textContent = 'Discard'
        discardBtn.style.height = '4.5vh';
        discardBtn.style.fontWeight = 'bolder';
        discardBtn.style.backgroundColor = '#195b8b';
        discardBtn.style.color = '#f5f5f7';
        discardBtn.style.border = '1px solid #112a40';
        discardBtn.style.borderRadius = '30px';
        discardBtn.style.width = '25vw';
        discardBtn.setAttribute('data-bs-toggle', 'modal');
        discardBtn.setAttribute('data-bs-target', '#staticBackdrop');

        saveButton.classList.add('save');
        discardBtn.classList.add('discard');

        expandButton.addEventListener('click', () => {
          this.animationActive = !this.animationActive;
          if (this.animationActive) {
            formElement.classList.add('animateForwards');
            formElement.classList.remove('animateBackwards');

            viewButton.replaceChild(saveButton, expandButton);
            signoutButton.replaceChild(discardBtn, exitButton);

            setTimeout(() => {
              content.style.display = 'block';
              content.classList.add('animateForwards');
            }, 1400);
          }
        });

        discardButton.setAttribute('data-bs-dismiss', 'modal');
        discardButton.addEventListener('click', () => {
          formElement.classList.remove('animateForwards');
          formElement.classList.add('animateBackwards');

          content.style.display = 'none';

          viewButton.replaceChild(expandButton, saveButton);
          signoutButton.replaceChild(exitButton, discardBtn);
        });
  }
  signOut(): void {
    this.authService.signout();
  }

}
