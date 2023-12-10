import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

import { AuthService } from 'src/app/util/services/auth.service';
@Component({
  selector: 'app-speeddoughnut',
  templateUrl: './speeddoughnut.component.html',
  styleUrls: ['./speeddoughnut.component.scss']
})
export class SpeeddoughnutComponent implements OnInit {
  doughnutChart: any;
  percentage: number = 100;
  id: any;
  aveSpeed: any;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token) {
      const tokenPayload = token.split(".")[1];
      const decodedPayload = atob(tokenPayload);
      const payloadData = JSON.parse(decodedPayload);
      this.id = payloadData.id;
    }
    this.authService.getSpeed(this.id).subscribe(
      res => {
        this.aveSpeed = res;
        this.doughnutChart = new Chart ('avr-speed',
        {
          type: 'doughnut',
          data: {
            labels: ['quiz speed by percentage'],
            datasets: [{
              data: [this.aveSpeed[0].average_speed, this.percentage],
              backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(255, 99, 132, 0.2)'
              ],
              hoverBackgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 99, 132, 0.5)'
              ]
            }]
          }
      });
     });

  }
}
