import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { interval } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-lessonpage',
  templateUrl: './lessonpage.component.html',
  styleUrls: ['./lessonpage.component.scss']
})
export class LessonpageComponent implements OnInit {
  @Output() returnLesson = new EventEmitter<void>();
  constructor(private authService : AuthService, private router: Router) {}
  public modules: any = [];
  public module: any = [];
  public chapters: any = [];
  public lesson: any;
  public chapterCount: any = [];
  public chapterValue! : number;
  public questions: any;
  public chapterNumber!: number;
  public chapterTitle!: string;
  public objectives!: string;
  public bullet: any = [];

  isLessonCompleted: boolean = false;
  isChapterCompleted: boolean = false;
  partCounter: number = 0;
  redirectTo: number = 3;
  paragraphLength! : number
  interval$: any;
  wrongAnswer!: boolean;
  email: any;
  parts: any;
  moduleClicked : boolean = false;
  countArray : any = [];

  ngOnInit(): void {
    const progress = document.querySelector('.progress-bar') as HTMLElement;
    const lessonButton = document.getElementById('lesson-button') as HTMLButtonElement;
    const questionButton = document.getElementById('question-button') as HTMLButtonElement;
    const token = localStorage.getItem('token');

    this.authService.allModules().subscribe(res => { this.modules = res; });

    if(token) {
      const tokenPayload = token.split(".")[1];
      const decodedPayload = atob(tokenPayload);
      const payloadData = JSON.parse(decodedPayload);
      this.email = payloadData.email;
    }

    window.addEventListener('scroll', () => {
      const scrollPercentage = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      progress.style.width = `${scrollPercentage}%`;
    });

    lessonButton.addEventListener('click', () => {
      const lesson = document.querySelector('.lesson-content') as HTMLElement;
      const question = document.querySelector('.question-content') as HTMLElement;
      lesson.style.display = 'block';
      question.style.display = 'none';
    });

    questionButton.addEventListener('click', () => {
      const lesson = document.querySelector('.lesson-content') as HTMLElement;
      const question = document.querySelector('.question-content') as HTMLElement;
      lesson.style.display = 'none';
      question.style.display = 'block';
    });
  }
  onClickModule(module: any) {
    this.authService.selectModule(module.mod_num).subscribe( res => { this.module = res; } );
    this.authService.getAllChapters(module.mod_num).subscribe(
      res => {
        this.chapters = res;
        let count = this.chapters.length;
        this.countArray = Array.from({ length: count }, (_, index) => index + 1);
      });
    const defaultPage = document.querySelector('.default') as HTMLElement;
    defaultPage.style.display = 'none';
  }
  answer(option: any) {
    if (option.correct) {
      this.isLessonCompleted = true;
    } else {
      const wrong = document.querySelector('.wrong-answer') as HTMLElement;
      wrong.style.display = 'block';
      this.isLessonCompleted = false;
      this.wrongAnswer = true;
      this.startCounter();
      this.redirectTo = 3;
    }
  }

  startCounter() {
    this.interval$ = interval(1000)
      .subscribe(val => {this.redirectTo--;});
    setTimeout(() => {
      const lesson = document.querySelector('.lesson-content') as HTMLElement;
      const question = document.querySelector('.question-content') as HTMLElement;
      const wrong = document.querySelector('.wrong-answer') as HTMLElement;
      lesson.style.display = 'block';
      question.style.display = 'none';
      wrong.style.display = 'none';
      this.interval$.unsubscribe();
    }, 3000);
  }

  backDefaultButton() {
    const defaultPage = document.querySelector('.default') as HTMLElement;
    const lessonPage = document.querySelector('.lesson-part') as HTMLElement;
    localStorage.removeItem('moduleNum');
    localStorage.removeItem('moduleTitle');
    defaultPage.style.display = 'block';
    lessonPage.style.display = 'none';
    this.chapterCount.splice(0, this.chapterCount.length);
    if (!this.moduleClicked) {
      let moduleClicked = () => {
        let moduleNum = localStorage.getItem('moduleNum');
        let moduleTitle = localStorage.getItem('moduleTitle');
        if (moduleNum && moduleTitle) {
          localStorage.removeItem('moduleNum');
          localStorage.removeItem('moduleTitle');
          this.authService.selectModule(moduleNum).subscribe( res => { this.module = res; } );
          this.authService.getAllChapters(moduleNum).subscribe( res => { this.chapters = res; } );
          const defaultPage = document.querySelector('.default') as HTMLElement;
          defaultPage.style.display = 'none';
          return;
        } else {
          setTimeout(moduleClicked, 100);
        }
      };
      moduleClicked();
    }
  }

  seePreview(chapters: any) {
    this.authService.retrieveChapter(chapters.chap_count).subscribe(
      res => {
        this.chapterCount = res;
      });
    this.chapterValue = chapters.chap_count;
    const chaptersHolder = document.querySelector('.chapter-holder') as HTMLElement;
    chaptersHolder.style.display = 'none';
  }

  backChaptersButton () {
    const chaptersHolder = document.querySelector('.chapter-holder') as HTMLElement;
    const chaptersContent = document.querySelector('.chapter-content') as HTMLElement;
    chaptersHolder.style.display = 'flex';
    chaptersContent.style.display = 'none';
  }

  readChapter() {
    this.wrongAnswer = false;
    this.authService.retrieveChapter(this.chapterValue).subscribe(
      res => {
        this.lesson = res;
        let reduce = res[0].chapter_content;
        this.parts = reduce.length - 1;
        localStorage.setItem('chapterSet', this.lesson[0].chap_name);
        localStorage.setItem('chapterTitle', this.lesson[0].chap_title);
        this.displayLesson();
        let correctAnswer = this.isLessonCompleted;
          if (!correctAnswer) {
            const waitUntilCompleted = () => {
              if (this.isLessonCompleted) {
                const nextBtn = document.querySelector('.proceed-button') as HTMLButtonElement;
                const progress = document.querySelector('.progress-bar') as HTMLElement;
                progress.style.width = '0%';
                nextBtn.disabled = false;
                nextBtn.addEventListener('click', () => {
                  const lesson = document.querySelector('.lesson-content') as HTMLElement;
                  const question = document.querySelector('.question-content') as HTMLElement;
                  lesson.style.display = 'block';
                  question.style.display = 'none';
                  this.partCounter++;
                });
                this.isLessonCompleted = false;
                correctAnswer = this.isLessonCompleted;
                return;
              }
              setTimeout(waitUntilCompleted, 100);
            };
            waitUntilCompleted();
            correctAnswer = this.isLessonCompleted;
          }

          if(this.partCounter < this.parts) {
            const chapterCompleted = () => {
              if (this.partCounter === this.parts) {
                const nextBtn = document.querySelector('.proceed-button') as HTMLButtonElement;
                nextBtn.textContent = 'Complete Lesson';
                nextBtn.disabled = true;
                if (this.isLessonCompleted) {
                  nextBtn.setAttribute('data-bs-toggle', 'modal');
                  nextBtn.setAttribute('data-bs-target', '#completeModal');
                  nextBtn.disabled = false;
                  const modal = document.querySelector('#completeModal') as HTMLElement;
                  modal.setAttribute("aria-hidden", "false");
                  if(!this.wrongAnswer) {
                    const title = 'Nice One';
                    this.authService.earn(title, this.email).subscribe(
                      () => {
                        console.log('Nice One earned!');
                      }
                    );
                  }
                  return;
                }
              }
              setTimeout(chapterCompleted, 100);
            };
            chapterCompleted();
          }
      });
  }
  displayLesson() {
    const frontPage = document.querySelector('.front-part') as HTMLElement;
    const backPage = document.querySelector('.back-part') as HTMLElement;
    const lessonButton = document.getElementById('lesson-button') as HTMLButtonElement;

    frontPage.style.display = 'none';
    backPage.style.display = 'flex';
    lessonButton.focus();
  }

  awaitAnswer() {
    const checkCompletion = () => {
      if (this.isLessonCompleted) {
        this.enableNextButton();
        this.partCounter++;
      } else {
        setTimeout(checkCompletion, 100);
      }
    }
    checkCompletion();
  }
  enableNextButton() {
    const nextBtn = document.querySelector('.proceed-button') as HTMLButtonElement;
    const progress = document.querySelector('.progress-bar') as HTMLElement;

    progress.style.width = '0%';
    nextBtn.disabled = false;

    nextBtn.addEventListener('click', () => {
      this.partCounter++;
    });
  }
  backModalButton() {
    const defaultPage = document.querySelector('.front-part') as HTMLElement;
    const lessonPage = document.querySelector('.back-part') as HTMLElement;
    const close = document.querySelector('.btn-close') as HTMLButtonElement;
    close.click();
    defaultPage.style.display = 'block';
    lessonPage.style.display = 'none';
  }
  generateDropdown() {
    const searchField = document.getElementById('search-field') as HTMLInputElement;
    this.authService.search(searchField.value).subscribe(
      res => {
        this.modules = res;
        const moduleHeader = document.querySelector('.module-header') as HTMLElement;
        moduleHeader.textContent = 'Search Results:';
      }
    );
  }
  nextChapterButton () {
    const close = document.querySelector('.btn-close') as HTMLButtonElement;
    const progress = document.querySelector('.progress-bar') as HTMLElement;
    progress.style.width = '0%';
    close.click();
    this.partCounter = 0;
    this.parts = 0;
    this.chapterValue = this.chapterValue + 1;
    this.isLessonCompleted = false;
    localStorage.removeItem('chapterSet');
    localStorage.removeItem('chapterTitle');
    this.readChapter();
  }
}
