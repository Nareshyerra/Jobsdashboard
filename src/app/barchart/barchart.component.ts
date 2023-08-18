import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { FormBuilder } from '@angular/forms';

import { AuthService } from '../services/auth.service';

import { JobscountService,  WeekApplicantCount  } from '../services/jobscount.service';

import { UserStoreService } from '../services/user-store.service';

@Component({

  selector: 'app-barchart',

  templateUrl: './barchart.component.html',

  styleUrls: ['./barchart.component.scss']

})

export class BarchartComponent implements OnInit {

  username: string = '';

  barChartData: any = {

    labels: [],

    datasets: [{

      data: [],

       label: 'Applicants Percentage weekly'

    }]

  };

  selectedWeek: number = this.getWeekNumber(new Date());
  selectedYear: number = new Date().getFullYear();
  // selectedWeek: number = this.getWeekNumber(new Date());
  // selectedYear: number = new Date().getFullYear();

  constructor( private fb: FormBuilder,   private auth: AuthService, private jobsCountService: JobscountService, private userStore: UserStoreService,

    private cdr: ChangeDetectorRef) {  }


  ngOnInit(): void {

    this.userStore.getFullNameFromStore()

      .subscribe(val => {

        const fullNameFromToken = this.auth.getfullNameFromToken();

        this.username = val || fullNameFromToken;
        this.populateChartData();
  
      });

  }


  onWeekSelectionChange(): void {
    this.populateChartData();
  }

  // async populateChartData(): Promise<void> {

  //   const username = this.username;

  //   const currentDate = new Date();

  //   const currentYear = currentDate.getFullYear();

  //   const currentWeek = this.getWeekNumber(currentDate);

  //   const numberOfWeeksToShow = 5;
 
  //   // const weekData: WeekApplicantCount[] = await this.jobsCountService
  //   // .getApplicantsPerWeek(username, this.selectedYear, this.selectedWeek)
  //   // .toPromise() || [];
  //   const weekData: WeekApplicantCount[] = await this.jobsCountService
  //   .getApplicantsPerWeek(username, this.selectedYear, this.selectedWeek)
  //   .toPromise() || [];

  // const weekDataMap: { [weekNumber: number]: number } = {};

  // for (const entry of weekData) {
  //   weekDataMap[entry.weekNumber] = entry.applicantCount;
  // }

  // const weekLabels = [];
  // const weekCounts = [];

  // for (let i = 0; i < numberOfWeeksToShow; i++) {
  //   const week = upcomingWeek - i >= 1 ? upcomingWeek - i : 53 + (upcomingWeek - i);

  //   weekLabels.unshift(`Week ${week}`);

  //   weekCounts.unshift(weekDataMap[week] || 0);
  // }

    
  //   // const weekData: WeekApplicantCount[] = await this.jobsCountService.getApplicantsPerWeek(username, currentYear, currentWeek).toPromise() || [];

  //   console.log("Week Data:", weekData);

  // const upcomingWeek = (currentWeek + 1) % 53;

  // console.log("Upcoming Week:", upcomingWeek);

  //   const weekLabels = [];

  //   const weekCounts = [];

 

  //   for (let i = 0; i < numberOfWeeksToShow; i++) {

  //     const week = upcomingWeek - i >= 1 ? upcomingWeek - i : 53 + (upcomingWeek - i);

  //     const weekEntry = weekData.find(entry => entry.weekNumber === week);

 

  //     weekLabels.unshift(`Week ${week}`);

  //     weekCounts.unshift(weekEntry ? weekEntry.applicantCount : 0);

  //   }

  //   console.log("Week Labels:", weekLabels);

  //   console.log("Week Counts:", weekCounts);

  //   this.barChartData.labels = weekLabels;

  //   this.barChartData.datasets[0].data = weekCounts;
  //   this.updateChart();

  // }
  async populateChartData(): Promise<void> {
    const username = this.username;
    const numberOfWeeksToShow = 5; // Define the number of weeks to show
  
    const weekData: WeekApplicantCount[] = await this.jobsCountService
      .getApplicantsPerWeek(username, this.selectedYear, this.selectedWeek)
      .toPromise() || [];
  
    const weekDataMap: { [weekNumber: number]: number } = {};
  
    for (const entry of weekData) {
      weekDataMap[entry.weekNumber] = entry.applicantCount;
    }
  
    const weekLabels = [];
    const newWeekCounts = [];
  
    const selectedWeekNumber = this.selectedWeek;
  
    for (let i = 0; i < numberOfWeeksToShow; i++) {
      const week = selectedWeekNumber - i >= 1 ? selectedWeekNumber - i : 53 + (selectedWeekNumber - i);
  
      weekLabels.unshift(`Week ${week}`);
  
      newWeekCounts.unshift(weekDataMap[week] || 0);
    }
  
    this.barChartData.labels = weekLabels;
    this.barChartData.datasets[0].data = newWeekCounts;
    this.updateChart();
  }
  
  

  // Function to get ISO week number of a date

  getWeekNumber(date: Date): number {

    const d = new Date(date);

    d.setHours(0, 0, 0, 0);

    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    return Math.ceil(((+d - +new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7);

  }
  updateChart(): void {
    if (this.barChartData && this.barChartData.datasets && this.barChartData.datasets.length > 0) {
      // Trigger the chart update by changing its data reference
      this.barChartData = { ...this.barChartData };
    }
  }



 

}