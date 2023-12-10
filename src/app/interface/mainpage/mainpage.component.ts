import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/util/services/auth.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.scss']
})
export class MainpageComponent implements OnInit {
  public header! : string;
  public greetings! : string;
  public leadingPoints : any = [];
  public userPlacement : any = [];
  public description : string = 'You are currently untitled. Play to earn rewards!';
  difficulty! : string;
  placed : boolean = true;


  username: any;
  rank: any;
  points: any;
  titles: any = [];
  userTitles: any = [];
  equippedTitle: any;
  email: any;
  selectedTitle!: string;
  id : any;

  conscriptURL = 'assets/icons/Conscript.png';
  awakenedURL = 'assets/icons/Awakened.png';
  astralURL = 'assets/icons/Astral.png';
  awakenedPoints = 300;
  astralPoints = 600;
  goalPoints!: number;
  rankPercentage!: number;
  goalRank!: string;
  surrenderClicked: boolean = false;


  constructor(private authService : AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenPayload = token.split(".")[1];
      const decodedPayload = atob(tokenPayload);
      const payloadData = JSON.parse(decodedPayload);
      this.username = payloadData.username;
      this.equippedTitle = payloadData.equipped;
      this.email = payloadData.email;
      this.id = payloadData.id;
    }
    this.authService.getPlacements(this.email).subscribe(
      res => {
        this.userPlacement = res;
        this.points = res[0].user_points;
        this.rank = res[0].user_rank;
      });
    this.authService.getTopTen().subscribe(
      res => {
        this.leadingPoints = res[0];
    });

    const gameButton = document.getElementById('gameButton') as HTMLButtonElement;
    gameButton.focus();

    const easyButton = document.querySelector('.easy') as HTMLButtonElement;
    const averageButton = document.querySelector('.average') as HTMLButtonElement;
    const hardButton = document.querySelector('.difficult') as HTMLButtonElement;
    const mainContent = document.querySelector('.main') as HTMLElement;
    easyButton.addEventListener('click', () => {
      this.header = 'Easy';
      this.greetings = "You are about to play Easy Mode. Continue playing until you unlock more modes. Have fun!";
    });
    averageButton.addEventListener('click', () => {
      this.header = 'Average';
      this.greetings = "You are about to play Average Mode. Continue playing until you unlock more modes. Have fun!";
    });
    hardButton.addEventListener('click', () => {
      this.header = 'Hard';
      this.greetings = "You are about to play Difficult Mode. Have fun!";
    });
    const playButton = document.querySelector('.play-button') as HTMLButtonElement;
    playButton.addEventListener('click', () => {
      if (this.header === 'Easy') {
        this.difficulty = this.header;
      } else if (this.header === 'Average') {
        this.difficulty = this.header;
      } else if (this.header === 'Hard') {
        this.difficulty = this.header;
      }
      const closeButton = document.querySelector('.close-button') as HTMLButtonElement;
      closeButton.click();
      mainContent.style.display = 'none';
    });
    const surrenderButton = document.querySelector('.confirm-button') as HTMLButtonElement;
      surrenderButton.addEventListener('click', () => {
        if (this.difficulty === 'Easy') {
          const easyComponent = document.querySelector('.easy-quiz') as HTMLElement;
          easyComponent.style.display = 'none';
          mainContent.style.display = 'block';
          this.difficulty = '';
          gameButton.focus();
        } else if (this.difficulty === 'Average') {
          const easyComponent = document.querySelector('.average-quiz') as HTMLElement;
          easyComponent.style.display = 'none';
          mainContent.style.display = 'block';
          this.difficulty = '';
          gameButton.focus();
        } else if (this.difficulty === 'Hard') {
          const easyComponent = document.querySelector('.hard-quiz') as HTMLElement;
          easyComponent.style.display = 'none';
          mainContent.style.display = 'block';
          this.difficulty = '';
          gameButton.focus();
        }
    });
  }

  toggleGame(): void {
    const game = document.getElementById('game-options') as HTMLElement;
    const badge = document.getElementById('game-badge') as HTMLElement;
    const leaderboards = document.getElementById('leaderboards') as HTMLElement;
    game!.style.display = 'flex';
    badge!.style.display = 'none';
    leaderboards!.style.display = 'none';
  }

  toggleBadge(): void {
    const game = document.getElementById('game-options') as HTMLElement;
    const badge = document.getElementById('game-badge') as HTMLElement;
    const leaderboards = document.getElementById('leaderboards') as HTMLElement;
    game.style.display = 'none';
    badge.style.display = 'flex';
    leaderboards.style.display = 'none';

    if (this.points < this.awakenedPoints) {
      this.goalPoints = this.awakenedPoints;
      this.goalRank = 'Awakened';
      this.rankPercentage = (this.points / this.awakenedPoints) * 100;
      const percentage = document.querySelector('.progress-bar') as HTMLElement;
      percentage.style.width = `${this.rankPercentage}%`;
    } else if (this.points > this.awakenedPoints && this.points < this.astralPoints) {
      this.goalPoints = this.astralPoints;
      this.goalRank = 'Astral';
      this.rankPercentage = (this.points / this.astralPoints) * 100;
      const percentage = document.querySelector('.progress-bar') as HTMLElement;
      percentage.style.width = `${this.rankPercentage}%`;
    } else if (this.points > this.astralPoints){
      const highPoints = document.querySelector('.points-requirements') as HTMLElement;
      highPoints.innerHTML = `<b>${this.points}</b> points`;
      const percentage = document.querySelector('.progress-bar') as HTMLElement;
      percentage.style.width = '100%';
    }

    if(this.points > this.awakenedPoints) {
      let rank = 'Awakened';
      this.authService.promote(rank, this.email).subscribe(
        () => {
          this.rank = rank;
          if(this.rank === 'Conscript') {
            var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
            imgIcon.src = this.conscriptURL;
          } else if (this.rank === 'Awakened') {
            var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
            imgIcon.src = this.awakenedURL;
          } else if (this.rank === 'Astral') {
            var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
            imgIcon.src = this.astralURL;
          }
        }
      );
    }
    if(this.points > this.astralPoints) {
      let rank = 'Astral';
      this.authService.promote(rank, this.email).subscribe(
        () => {
          this.rank = rank;
          if(this.rank === 'Conscript') {
            var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
            imgIcon.src = this.conscriptURL;
          } else if (this.rank === 'Awakened') {
            var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
            imgIcon.src = this.awakenedURL;
          } else if (this.rank === 'Astral') {
            var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
            imgIcon.src = this.astralURL;
          }
          }
          );
    }

    if(this.rank === 'Conscript') {
      var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
      imgIcon.src = this.conscriptURL;
    } else if (this.rank === 'Awakened') {
      var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
      imgIcon.src = this.awakenedURL;
    } else if (this.rank === 'Astral') {
      var imgIcon = document.getElementById('rank-icon') as HTMLImageElement;
      imgIcon.src = this.astralURL;
    }
  }

  toggleLeaderboards(): void {
    const game = document.getElementById('game-options') as HTMLElement;
    const badge = document.getElementById('game-badge') as HTMLElement;
    const leaderboards = document.getElementById('leaderboards') as HTMLElement;

    const topOneElement = document.querySelector('.topOne') as HTMLElement;
    const topTwoElement = document.querySelector('.topTwo') as HTMLElement;
    const topThreeElement = document.querySelector('.topThree') as HTMLElement;
    const topFourElement = document.querySelector('.topFour') as HTMLElement;
    const topFiveElement = document.querySelector('.topFive') as HTMLElement;
    const topSixElement = document.querySelector('.topSix') as HTMLElement;
    const topSevenElement = document.querySelector('.topSeven') as HTMLElement;
    const topEightElement = document.querySelector('.topEight') as HTMLElement;
    const topNineElement = document.querySelector('.topNine') as HTMLElement;
    const topTenElement = document.querySelector('.topTen') as HTMLElement;
    const userPlaced = document.querySelector('.user-placement') as HTMLElement;
    game!.style.display = 'none';
    badge!.style.display = 'none';
    leaderboards!.style.display = 'flex';

    if (this.userPlacement[0]?.placement === 1) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topOneElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 2) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topTwoElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 3) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topThreeElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 4) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topFourElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 5) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topFiveElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 6) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topSixElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 7) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topSevenElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 8) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topEightElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 9) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topNineElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    } else if (this.userPlacement[0]?.placement === 10) {
      const tableBody = document.querySelector('tbody') as HTMLElement;
      userPlaced.style.border = '1px solid #1d1d1f';
      userPlaced.style.backgroundColor = '#d3d3d3';
      const placedBoolean = () => {
        if (this.placed) {
          tableBody?.replaceChild(userPlaced, topTenElement);
          this.placed = false;
          return;
        }
        setTimeout(placedBoolean, 100);
      }
      placedBoolean();
      return;
    }
  }

  finishedQuiz () {
    const forfeit = document.querySelector('.forfeit-btn') as HTMLButtonElement;
    const mainContent = document.querySelector('.main') as HTMLElement;
    const gameButton = document.getElementById('gameButton') as HTMLButtonElement;
    forfeit.textContent = 'Back to Home';
    forfeit.removeAttribute('data-bs-target');
    forfeit.removeAttribute('data-bs-toggle');
    forfeit.addEventListener('click', () => {
      if (this.difficulty === 'Easy') {
        const easyComponent = document.querySelector('.easy-quiz') as HTMLElement;
        easyComponent.style.display = 'none';
        mainContent.style.display = 'block';
        this.difficulty = '';
        gameButton.focus();
      } else if (this.difficulty === 'Average') {
        const easyComponent = document.querySelector('.average-quiz') as HTMLElement;
        easyComponent.style.display = 'none';
        mainContent.style.display = 'block';
        this.difficulty = '';
        gameButton.focus();
      } else if (this.difficulty === 'Hard') {
        const easyComponent = document.querySelector('.hard-quiz') as HTMLElement;
        easyComponent.style.display = 'none';
        mainContent.style.display = 'block';
        this.difficulty = '';
        gameButton.focus();
      }
    });
  }

  toggleTitles() {
    this.authService.getAllTitles().subscribe(res => { this.titles = res; });
    this.authService.getUserTitles(this.id).subscribe(res => { this.userTitles = res;});
  }

  onClickTitles(titles: any) {
    this.selectedTitle = titles.title_name;
    this.authService.getTitleDesc(titles.title_count).subscribe( res => { this.description = res[0].title_description; } );
    const showEquip = document.getElementById('equip-button') as HTMLButtonElement;
    let found = false;
    for(var i = 0; i < this.userTitles.length; i++) {
      if (this.userTitles[i].earned_title_id === titles.title_count) {
        found = true;
        break;
      }
    }
    showEquip.style.display = 'block';
    if (titles.title_name === this.equippedTitle) {
      showEquip.textContent = 'Equipped';
      showEquip.disabled = true;
    } else if (!found) {
      showEquip.textContent = 'Locked';
      showEquip.disabled = true;
    } else {
      showEquip.textContent = 'Equip Title';
      showEquip.disabled = false;
    }
    showEquip.addEventListener('click', () => {
      this.equippedTitle = titles.title_name;
      showEquip.disabled = true;
      showEquip.textContent = 'Equipped';
      this.authService.changeTitle(this.equippedTitle, this.email).subscribe();
    });
  }
}
