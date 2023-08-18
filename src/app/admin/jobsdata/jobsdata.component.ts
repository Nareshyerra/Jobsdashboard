import { Component, Input,  OnInit,  AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';

import { JobsdetailsService } from 'src/app/jobsdetails.service';
import { JobscountService } from 'src/app/services/jobscount.service';


import { UserStoreService } from 'src/app/services/user-store.service';
import { AuthService } from 'src/app/services/auth.service';


import Chart from 'chart.js/auto';


@Component({
  selector: 'app-jobsdata',
  templateUrl: './jobsdata.component.html',
  styleUrls: ['./jobsdata.component.scss']
})
export class JobsdataComponent implements AfterViewInit {
  @ViewChild('jobsChart') jobsChartCanvas!: ElementRef;
  @Input() totalJobsCount!: number;
  @Input() totalApplicantsCount!: number;
  @Input() totalAppliedJobsCount!: number;
  @Input() notAppliedJobsCount!: number;
  


username: string ='';
  constructor( private jobsint:JobsdetailsService,private auth:AuthService ,private jobsCountService: JobscountService, private userStore: UserStoreService) {
   
   }
   ngAfterViewInit(): void {
    this.getJobsCounts(); // Fetch the data asynchronously
    this.updateChart(); // Initialize the chart after data is fetched
  }


  ngOnInit(): void {


    this.userStore.getFullNameFromStore()
        .subscribe(val=>{
          const fullNameFromToken = this.auth.getfullNameFromToken();
          this.username = val || fullNameFromToken
        });
        this.updateChart();
        this.getJobsCounts(); 
  }


  
  getJobsCounts(): void {
  
    
    this.jobsCountService.getTotalJobsCount(this.username).subscribe(
      (count) => {
        this.totalJobsCount = count;
        console.log(count)
        this.updateChart();
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
    
  }



 
  updateChart(): void {
    
    if (
      this.totalJobsCount === undefined ||
      this.totalApplicantsCount === undefined ||
      this.totalAppliedJobsCount === undefined ||
      this.notAppliedJobsCount === undefined
    ) {
      return; 
    }

    const jobsChartCanvas = this.jobsChartCanvas.nativeElement.getContext('2d');
    new Chart(jobsChartCanvas, {
      type: 'bar',
      data: {
        labels: ['Total Jobs', 'No. of Applicants', 'Applied Jobs', 'Not Applied Jobs'],
        datasets: [
          {
            label: 'Counts',
            data: [
              this.totalJobsCount,
              this.totalApplicantsCount,
              this.totalAppliedJobsCount,
              this.notAppliedJobsCount
            ],
            backgroundColor: ['green', 'yellow', 'blue', 'red'],
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
    
  }

}