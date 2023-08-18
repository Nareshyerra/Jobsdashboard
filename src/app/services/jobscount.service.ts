import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Observable, catchError } from 'rxjs';

 

 

export interface WeekApplicantCount {

  weekNumber: number;

  applicantCount: number;

}

 

export interface RecentApplicantViewModel {

  applicantName: string;

  applicantEmail: string;

  jobTitle: string;

  companyLocation: string;

  skills: string;

  appliedDate: string;

}

 

@Injectable({

  providedIn: 'root'

})

export class JobscountService {

 

 

  private apiUrl = 'https://localhost:7058/api/Jobs';

  private ApiUrl = 'https://localhost:7058/api/Resumes';

 

  constructor(private http: HttpClient) {}

 

 

  getDailyJobsCounts(username: string): Observable<number[]> {

    return this.http.get<number[]>(`${this.apiUrl}/DailyJobsCountOrdered/${username}`);

  }

  getTotalJobsCount(username: string): Observable<number> {

    return this.http.get<number>(`${this.apiUrl}/count/${username}`);

  }

 

  getTotalApplicantsCount(username: string): Observable<number> {

    return this.http.get<number>(`${this.ApiUrl}/TotalApplicantsCount/${username}`);

  }

 

  getTotalAppliedJobsCount(username: string): Observable<number> {

    return this.http.get<number>(`${this.apiUrl}/TotalAppliedJobsCount/${username}`);

  }

 

  getNotAppliedJobsCount(username: string): Observable<number> {

    return this.http.get<number>(`${this.apiUrl}/NotAppliedJobsCount/${username}`);

  }

    getSchedulingMeetingCount(username: string): Observable<number> {

      return this.http.get<number>(`${this.ApiUrl}/SchedulingMeetingCount?username=${username}`);

    }

 

    // getNonScheduledMeetingCount(username: string): Observable<number> {

    //   return this.http.get<number>(`${this.ApiUrl}/NonScheduledMeetingCount?username=${username}`);

    // }

    getNoStatusCount(username: string): Observable<number> {

      return this.http.get<number>(`${this.ApiUrl}/NoStatusCount?username=${username}`);

    }

   

    getRejectedCount(username: string): Observable<number> {

      return this.http.get<number>(`${this.ApiUrl}/RejectedCount?username=${username}`);

    }

   

    getApplicantsPerWeek(username: string, year: number, week: number): Observable<WeekApplicantCount[]> {

    const url = `${this.ApiUrl}/ApplicantsPerWeek?username=${username}&year=${year}&week=${week}`;

    return this.http.get<WeekApplicantCount[]>(url);

   }

}