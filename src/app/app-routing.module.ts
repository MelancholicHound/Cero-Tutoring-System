import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginpageComponent } from './forms/loginpage/loginpage.component';
import { SignuppageComponent } from './forms/signuppage/signuppage.component';
import { LessonpageComponent } from './interface/lessonpage/lessonpage.component';
import { MainpageComponent } from './interface/mainpage/mainpage.component';
import { UserpageComponent } from './interface/userpage/userpage.component';
import { RecoveryComponent } from './forms/recovery/recovery.component';

const routes: Routes = [
  { path : '', pathMatch : 'full', redirectTo : '/login'},
  { path : 'login' , component : LoginpageComponent },
  { path : 'signup' , component : SignuppageComponent },
  { path : 'lesson' , component : LessonpageComponent },
  { path : 'main' , component : MainpageComponent },
  { path : 'user', component : UserpageComponent },
  { path : 'recovery', component : RecoveryComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
