import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

import { AuthService } from 'src/app/util/services/auth.service';
@Component({
  selector: 'app-accuracydoughnut',
  templateUrl: './accuracydoughnut.component.html',
  styleUrls: ['./accuracydoughnut.component.scss']
})
export class AccuracydoughnutComponent implements OnInit {
  doughnutChart: any;
  percentage: number = 100;
  aveAccuracy: any;
  id: any;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if(token) {
      const tokenPayload = token.split(".")[1];
      const decodedPayload = atob(tokenPayload);
      const payloadData = JSON.parse(decodedPayload);
      this.id = payloadData.id;
    }
    this.authService.getAccuracy(this.id).subscribe(
      res => {
        this.aveAccuracy = res;
        this.doughnutChart = new Chart ('avr-accuracy',
        {
          type: 'doughnut',
          data: {
            labels: ['quiz accuracy by percentage'],
            datasets: [{
              data: [this.aveAccuracy[0].average_accuracy, this.percentage],
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
