import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChangeBgDirective } from './change-bg.directive';

import { NavigationComponent } from './tools/navigation/navigation.component';
import { AccuracydoughnutComponent } from './statistics/accuracydoughnut/accuracydoughnut.component';
import { SpeeddoughnutComponent } from './statistics/speeddoughnut/speeddoughnut.component';
import { MainpageComponent } from './interface/mainpage/mainpage.component';
import { LessonpageComponent } from './interface/lessonpage/lessonpage.component';
import { LoginpageComponent } from './forms/loginpage/loginpage.component';
import { SignuppageComponent } from './forms/signuppage/signuppage.component';
import { UserpageComponent } from './interface/userpage/userpage.component';
import { EasyComponent } from './quiz/easy/easy.component';
import { AverageComponent } from './quiz/average/average.component';
import { HardComponent } from './quiz/hard/hard.component';
import { RecoveryComponent } from './forms/recovery/recovery.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AccuracydoughnutComponent,
    SpeeddoughnutComponent,
    MainpageComponent,
    LessonpageComponent,
    LoginpageComponent,
    SignuppageComponent,
    ChangeBgDirective,
    UserpageComponent,
    AverageComponent,
    EasyComponent,
    HardComponent,
    RecoveryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
