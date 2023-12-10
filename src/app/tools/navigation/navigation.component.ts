import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  header : any;
  title : any;
  chapterClicked : boolean = false;
  currentChapter : any;

  constructor() {}

  ngOnInit(): void {
    const heading = document.getElementById('heading') as HTMLElement;
    const title = document.getElementById('title') as HTMLElement;
    const homeButton = document.getElementById('home') as HTMLButtonElement;
    const lessonButton = document.getElementById('lesson') as HTMLButtonElement;
    const userButton = document.getElementById('info') as HTMLButtonElement;

    homeButton.addEventListener("click", () => {
      heading.textContent = "Home";
      title.textContent = '';
      this.chapterClicked = false;
      localStorage.removeItem("chapterSet");
      localStorage.removeItem("chapterTitle");
    });

    lessonButton.addEventListener("click", () => {
      heading.textContent = "Lesson";
      title.textContent = '';
      if (!this.chapterClicked) {
        const awaitChapterKey = () => {
          let retrievedHeader = localStorage.getItem("chapterSet");
          let retrievedTitle = localStorage.getItem("chapterTitle");
          if (retrievedHeader && retrievedTitle){
            heading.textContent = `${retrievedHeader}`;
            title.textContent = `${retrievedTitle}`;
            localStorage.removeItem("chapterSet");
            localStorage.removeItem("chapterTitle");
            return;
          } else {
            setTimeout(awaitChapterKey, 100);
          }
        }
        awaitChapterKey();
        this.chapterClicked = true;
      }
      this.chapterClicked = false;
    });

    userButton.addEventListener("click", () => {
      this.chapterClicked = false;
      heading.textContent = "Profile";
      title.textContent = '';
      localStorage.removeItem("chapterSet");
      localStorage.removeItem("chapterTitle");
    });
  }
}
