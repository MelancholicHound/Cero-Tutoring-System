import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, ObservableNotification, throwError } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';

import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = "http://192.168.0.102:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean> (false);

  isUserLoggedIn = this.isUserLoggedIn$.asObservable();

  userId! : Pick<User, "id">;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) { }

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http
    .post<User>(`${this.url}/signup`, user, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<User>("signup"))
    );
  }

  verifyotp(email : string, otp : any): Observable<any> {
    const verificationData = { email, otp };

    return this.http
      .post<any>(`${this.url}/verify-otp`, verificationData, this.httpOptions)
      .pipe(
        first(),
        catchError((error) => {
          if (error.status === 400 && error.error && error.error.message) {
            this.errorHandler.handleError("Authentication failed", error.error.message);
          }
          return throwError(error);
        })
      );
  }

  login(email: Pick<User, "email">, password: Pick<User, "password">):
  Observable<{
    token: string;
    userId: Pick<User, "id">;
  }>{
    return this.http
    .post<{
      token: string;
      userId: Pick<User, "id">;
    }>(`${this.url}/login`, { email, password }, this.httpOptions)
    .pipe(
      first(),
      tap((tokenObject: { token : string; userId : Pick<User, "id">;}) => {
        this.userId = tokenObject.userId;
        localStorage.setItem("token", tokenObject.token);
        this.isUserLoggedIn$.next(true);
      }),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorHandler.handleError("Login failed", error.error.message);
        }
        return throwError(error);
      })
    );
  }
  signout(): void {
    localStorage.removeItem('token');
    this.isUserLoggedIn$.next(false);
    this.router.navigate(["login"]);
  }

  retrieveChapter(chapter : number): Observable<any> {
    const chapterInput = { chapter };
    return this.http.post(`${this.url}/chapters`, chapterInput, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('chapters'))
    );
  }

  retrieveQuestions(difficulty : string, set : number): Observable<any> {
    const difficultyInput = { difficulty , set };

    return this.http.post<any>(`${this.url}/questions`, difficultyInput, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('questions'))
    );
  }

  getDescription(achievement : string): Observable<any> {
    const achievementInput = { achievement };

    return this.http.post<any>(`${this.url}/desc`, achievementInput, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('desc'))
    );
  }

  changeTitle(equipped_title : string, email : string): Observable<any> {
    const titleInput = { equipped_title, email };

    return this.http.post<any>(`${this.url}/change-title`, titleInput, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('change-title'))
    );
  }

  addPoints(points : number, email : string): Observable<any> {
    const pointsInput = { points, email };

    return this.http.post<any>(`${this.url}/add-points`, pointsInput, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('add-points'))
    )
  }
  getTopTen(): Observable<any> {
    return this.http.get<any>(`${this.url}/leaderboards`, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('add-points'))
    );
  }
  getPlacements(email : string): Observable<any> {
    const emailInput = { email };

    return this.http.post<any>(`${this.url}/placements`, emailInput, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('placements'))
    )
  }
  update(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/update`, user, this.httpOptions)
      .pipe(
        first(),
        catchError(this.errorHandler.handleError<User>('update'))
      );
  }
  earn(title: string, id: any): Observable<any> {
    const earnedTitle = { title, id };
    return this.http.post<any>(`${this.url}/earn`, earnedTitle, this.httpOptions)
    .pipe(
      first(),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorHandler.handleError("Duplication detected", error.error.message);
        }
        return throwError(error);
      })
    );
  }
  allModules(): Observable<any> {
    return this.http.post<any>(`${this.url}/module`, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('modules'))
    );
  }

  selectModule(mod_num: any): Observable<any> {
    const fetchedNumber = { mod_num };
    return this.http.post<any>(`${this.url}/get-module`, fetchedNumber, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('get-module'))
    )
  }

  getAllChapters(mod_num: any): Observable<any> {
    const fetchedNumber = { mod_num };
    return this.http.post<any>(`${this.url}/all-chapters`, fetchedNumber, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('all-chapters'))
    );
  }

  promote(user_rank: any, email: any): Observable<any> {
    const fetchedRank = { user_rank, email }
    return this.http.post<any>(`${this.url}/promote`, fetchedRank, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('promote'))
    )
  }

  search(mod_name: any): Observable<any> {
    const fetchedChar = { mod_name };
    return this.http.post<any>(`${this.url}/search`, fetchedChar, this.httpOptions)
    .pipe(
      first(),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorHandler.handleError("No matched module", error.error.message);
        }
        return throwError(error);
      })
    )
  }
  recover(email: any): Observable<any> {
    const fetchedEmail = { email };
    return this.http.post<any>(`${this.url}/recover`, fetchedEmail, this.httpOptions)
    .pipe(
      first(),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorHandler.handleError("No matched module", error.error.message);
        }
        return throwError(error);
      })
    )
  }
  changePassword(password: any, email: any): Observable<any> {
    const fetchedData = { password, email };
    return this.http.post<any>(`${this.url}/change-password`, fetchedData, this.httpOptions)
    .pipe(
      first(),
      catchError((error) => {
        if (error.status === 400 && error.error && error.error.message) {
          this.errorHandler.handleError("No matched module", error.error.message);
        }
        return throwError(error);
      })
    )
  }
  getAccuracy(user_id: any): Observable<any> {
    const fetchedId = { user_id };
    return this.http.post<any>(`${this.url}/accuracy`, fetchedId, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('accuracy'))
    )
  }

  getSpeed(user_id:any): Observable<any> {
    const fetchedId = { user_id };
    return this.http.post<any>(`${this.url}/speed`, fetchedId, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('speed'))
    );
  }
  insertSpeed(grade: any, id: any): Observable<any> {
    const fetchedGrade = { grade, id };
    return this.http.post<any>(`${this.url}/grade-speed`, fetchedGrade, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('grade-speed'))
    );
  }
  insertAccuracy(grade: any, id: any): Observable<any> {
    const fetchedGrade = { grade, id };
    return this.http.post<any>(`${this.url}/grade-accuracy`, fetchedGrade, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('grade-accuracy'))
    );
  }
  insertProgress(percent: any, email: any): Observable<any> {
    const fetchedProgress = { percent, email };
    return this.http.post<any>(`${this.url}/progress`, fetchedProgress, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('progress'))
    );
  }
  getUserTitles(id: any): Observable<any> {
    const fetchedId = { id };
    return this.http.post<any>(`${this.url}/user-titles`, fetchedId, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('user-titles'))
    );
  }
  getAllTitles(): Observable<any> {
    return this.http.post<any>(`${this.url}/all-titles`, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('all-titles'))
    )
  }
  getTitleDesc(id: any): Observable<any> {
    const fetchedId = { id };
    return this.http.post<any>(`${this.url}/title-desc`, fetchedId, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('title-desc'))
    );
  }
  getAllEasySet(): Observable<any> {
    return this.http.post<any>(`${this.url}/all-easy`, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('all-easy'))
    )
  }
  getAllMediumSet(): Observable<any> {
    return this.http.post<any>(`${this.url}/all-medium`, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('all-medium'))
    )
  }
  getAllHardSet(): Observable<any> {
    return this.http.post<any>(`${this.url}/all-hard`, this.httpOptions)
    .pipe(
      first(),
      catchError(this.errorHandler.handleError<any>('all-hard'))
    )
  }
}
