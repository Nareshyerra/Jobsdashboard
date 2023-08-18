import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {  JobscountService } from 'src/app/services/jobscount.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { forkJoin } from 'rxjs';

 

@Component({

  selector: 'app-client-home',

  templateUrl: './client-home.component.html',

  styleUrls: ['./client-home.component.scss']

})


export class ClientHomeComponent implements OnInit {

  @Input() totalJobsCount!: number;

  @Input() totalApplicantsCount!: number;

  @Input() totalAppliedJobsCount!: number;

  @Input() notAppliedJobsCount!: number;


  isClientHomeComponent = true;
  username: string = '';

  pieChartLabels: string[] = ['Interview scheduled', 'Status not Posted', 'Rejected Resumes'];

  pieChartData = {

    labels: ["Interview scheduled", "Status not Posted", "Rejected"],

    datasets: [

      {

        data: [0, 0, 0],

        label: 'weekly',

        backgroundColor: [

          'rgba(255, 0, 25, 0.7)',

          'rgba(67, 25, 255, 0.7)',

          'rgba(67, 255, 178, 0.7)',

        ],
      },

    ],

  };

  pieChartOption = {

  responsive: false,

 
  };

  constructor(private auth: AuthService, private jobsCountService: JobscountService, private userStore: UserStoreService, private cdr: ChangeDetectorRef) {

  }

 ngOnInit(): void {

    this.userStore.getFullNameFromStore()

      .subscribe(val => {

        const fullNameFromToken = this.auth.getfullNameFromToken();

        this.username = val || fullNameFromToken

      });

    this.getJobsCounts();

  }

 getJobsCounts(): void {
    this.jobsCountService.getTotalJobsCount(this.username).subscribe(

      (count) => {

        this.totalJobsCount = count;
      },

      (error) => {

        console.error('Error fetching total jobs count: ', error);

      }

    );
    this.jobsCountService.getTotalApplicantsCount(this.username).subscribe(

      (count) => {

        this.totalApplicantsCount = count;

      },

      (error) => {

        console.error('Error fetching total applicants count: ', error);

      }

    );

    this.jobsCountService.getTotalAppliedJobsCount(this.username).subscribe(

      (count) => {

        this.totalAppliedJobsCount = count;

      },

      (error) => {

        console.error('Error fetching total applied jobs count: ', error);

      }

    );
    this.jobsCountService.getNotAppliedJobsCount(this.username).subscribe(

      (count) => {

        this.notAppliedJobsCount = count;

      },

      (error) => {

        console.error('Error fetching not applied jobs count: ', error);

      }

    );

    const schedulingMeetingCount$ = this.jobsCountService.getSchedulingMeetingCount(this.username);

    const noStatusCount$ = this.jobsCountService.getNoStatusCount(this.username);

    const rejectedCount$ = this.jobsCountService.getRejectedCount(this.username);

    const allCounts$ = forkJoin([schedulingMeetingCount$, noStatusCount$, rejectedCount$]);

    allCounts$.subscribe(

      ([schedulingMeetingCount, noStatusCount, rejectedCount]: [number, number, number]) => {

        console.log('Fetched Data:', schedulingMeetingCount, noStatusCount, rejectedCount);

        this.pieChartData.datasets[0].data = [schedulingMeetingCount, noStatusCount, rejectedCount];

        this.cdr.detectChanges(); // Manually trigger change detection

        console.log('Updated Pie Chart Data:', this.pieChartData);
        this. updateChart()
      

      },

      (error: any) => {

        const errorMessage = error.error && error.error.message ? error.error.message : 'An error occurred.';

        console.error('Error fetching data: ', errorMessage);

      }

    );

  }

  

  
  updateChart(): void {
    if (this. pieChartData && this.pieChartData.datasets && this.pieChartData.datasets.length > 0) {
      // Trigger the chart update by changing its data reference
      this.pieChartData = { ...this.pieChartData };
    }
  }
}