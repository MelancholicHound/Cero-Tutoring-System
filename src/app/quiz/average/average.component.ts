import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';

import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-average',
  templateUrl: './average.component.html',
  styleUrls: ['./average.component.scss']
})
export class AverageComponent implements OnInit {
  @Output() finish = new EventEmitter<void>();
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  counter = 30;
  correctAnswer: number = 0;
  inCorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted: boolean = false;
  difficulty: string = 'average';
  set: number = 1;
  email: any;
  username: any;
  titles : any = [];
  prompt : boolean = false;
  found : boolean = false;
  titleEarned : any = [];
  streak : number = 0;
  id : any;
  seconds : any = [];

  constructor(private authService : AuthService) {}

  ngOnInit(): void {
    this.getAverageQuestions();
    this.startCounter();
    const token = localStorage.getItem("token")
    if(token) {
      const tokenPayload = token.split(".")[1];
      const decodedPayload = atob(tokenPayload);
      const payloadData = JSON.parse(decodedPayload);
      this.email = payloadData.email;
      this.username = payloadData.username;
      this.id = payloadData.id;
      const fetchedTitles = payloadData.userTitle;
      if (fetchedTitles) {
        this.titles = fetchedTitles.split(', ');
      }
    }
    if (!this.isQuizCompleted) {
      const getGainedPoints = () => {
        if(this.isQuizCompleted) {
          this.authService.addPoints(this.points, this.email).subscribe(
            () => {
              console.log(`Added ${this.points}`);
            });
            return;
        }
        setTimeout(getGainedPoints, 100);
      }
      getGainedPoints();
    }
  }

  getAverageQuestions() {
    this.authService.getAllMediumSet().subscribe(
      res => {
        const fetchedLength = Math.floor(Math.random() * res.length) + 1;
        this.authService.retrieveQuestions(this.difficulty, fetchedLength).subscribe(
          res => {
            this.questionList = res.averageSet;
          });
      }
    );
  }
  nextQuestion() {
    this.currentQuestion++;
  }
  prevQuestion() {
    this.currentQuestion--;
  }

  answer (currentQno: number, option: any) {
    if(currentQno === this.questionList.length) {
      this.isQuizCompleted = true;
      this.stopCounter();
      this.finish.emit();
      const accuracyPercentage = (this.streak / this.questionList.length) * 100;
      this.authService.insertAccuracy(accuracyPercentage, this.id).subscribe(
        () => {
          console.log(accuracyPercentage);
        }
      );
      let sum = 0;
      for (let i = 0; i < this.seconds.length; i++) {
        sum += this.seconds[i];
      }
      let average = sum / this.seconds.length;
      this.authService.insertSpeed(average, this.id).subscribe(
        () => {
          console.log(average);
        }
      );
      if (this.inCorrectAnswer === 0) {
        const title = 'Sensational';
        this.authService.earn(title, this.id).subscribe(
          () => { this.titleEarned.push(title) },
          (error) => { console.log(error); }
        );
      }
    }

    if(option.correct) {
      this.points += 10;
      this.correctAnswer++;
      this.streak++;
      this.seconds.push(this.counter);
      if (this.counter >= 26) {
        const promptTitle = () => {
          if (!this.prompt) {
            const title = 'Speedster';
            for (var i = 0; i < this.titles.length; i++) {
              if (this.titles[i] === title) {
                this.found = true;
                break;
              }
            }
            if (!this.found) {
              this.authService.earn(title, this.id).subscribe(
                () => { this.titleEarned.push(title) },
                (error) => { console.log(error); });
            }
            if (this.counter >= 23) {
              const title = () => {
                if (this.isQuizCompleted && this.inCorrectAnswer === 0) {
                  const earned = 'Confident';
                  this.authService.earn(earned, this.id).subscribe(
                  () => { this.titleEarned.push(earned); });
                  return;
                }
                setTimeout(title, 100);
              }
              title();
            }
            this.prompt = true;
            return;
          }
          setTimeout(promptTitle, 100);
        }
        promptTitle();
      }
      setTimeout(() => {
        this.currentQuestion++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    } else {
      this.seconds.push(this.counter);
      setTimeout(() => {
        this.streak = 0;
        this.currentQuestion++;
        this.inCorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    }
  }

  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {
        this.counter--;
        if (this.counter === 0) {
          this.currentQuestion++;
          this.counter = 30;
        }
      });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 300000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 30;
    this.startCounter();
  }

  resetQuiz() {
    this.resetCounter();
    this.getAverageQuestions();
    this.points = 0;
    this.counter = 30;
    this.currentQuestion = 0;
    this.progress = "0";
  }

  getProgressPercent() {
    this.progress = ((this.currentQuestion / this.questionList.length) * 100).toString();
    return this.progress;
  }
}
