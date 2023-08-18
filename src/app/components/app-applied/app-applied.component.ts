import { Component, OnInit } from '@angular/core';

import { AppStoreService } from 'src/app/app-store.service';

import { JobsdetailsService } from 'src/app/jobsdetails.service';

import { AuthnService } from 'src/app/services/authn.service';

interface ResumeViewModel {
  resumeId:number;
  applicantName: string;
  applicantEmail: string;
  resumeFileName: string;
  resumeFileData: string; // This will be a base64 encoded string
  RejectionReason: string; // Add this property to support rejectionReason
  scheduleMeetingDate: Date; // Add this property to support scheduleMeetingDate
  jobId: number;
  Status:string
  statusInput?: string;
  IsStatusSelected: boolean;
}

 interface JobResumeViewModel {
  jobId: number;
  companyName: string;
  jobTitle: string;
  experience: string;
  skills: string;
  jobType: string;
  postedDate: string;
  location: string;
  jobDescription: string;
  resumes: ResumeViewModel[];
}


@Component({
  selector: 'app-app-applied',
  templateUrl: './app-applied.component.html',
  styleUrls: ['./app-applied.component.scss']
})
export class AppAppliedComponent implements OnInit {
  appliedJobs: any[]=[];
  itemsPerPage: number = 20;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];

  displayedAppliedJobs: any[] = [];
  clickedJobId: number | null = null;
  
  showStatusMessage: boolean = false;
appliedUsername:string='';
  constructor( private jobsint: JobsdetailsService, private authn:AuthnService, private userStore:AppStoreService) {
    this.totalPages = Math.ceil(this.appliedJobs.length / this.itemsPerPage);
    this.generatePageNumbers();
  }
  ngOnInit() {

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.authn.getfullNameFromToken();
      this.appliedUsername = val || fullNameFromToken;

      if (this.appliedUsername) {
        this.jobsint.getAppliedJobsByUser(this.appliedUsername).subscribe((data: any) => {
          console.log('Applied Username:', this.appliedUsername);

          this.appliedJobs = data;
          this.totalPages = Math.ceil(this.appliedJobs.length / this.itemsPerPage);
          this.generatePageNumbers();

          this.updateStatusMessages();
        
          // Update displayed jobs
          this.updateDisplayedAppliedJobs();
      
        });
      }
    });
  

   
  }



updateDisplayedAppliedJobs() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  this.displayedAppliedJobs = this.appliedJobs.slice(startIndex, endIndex);
}

previousPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
    this.updateDisplayedAppliedJobs();
    this.generatePageNumbers();
  }
}

nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
    this.updateDisplayedAppliedJobs();
    this.generatePageNumbers();
  }
}

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.currentPage = page;
    this.updateDisplayedAppliedJobs();
  }
}

generatePageNumbers() {
  this.pages = [];
  for (let i = 1; i <= this.totalPages; i++) {
    this.pages.push(i);
  }
}



updateStatusMessages() {
  this.appliedJobs.forEach(jobItem => {
    // Fetch the schedule meeting date for the job from the Resumes API
    this.jobsint.getScheduleMeetingDateByJobAndName(jobItem.jobId, this.appliedUsername).subscribe(
      (scheduleMeetingDate) => {
        // Update the job object with the schedule meeting date if it's available
        if (scheduleMeetingDate) {
          jobItem.scheduleMeetingDate = 'Interview is scheduled on: ' + scheduleMeetingDate;
          jobItem.rejectionReason = null; 
        } else {
          jobItem.scheduleMeetingDate = 'Meeting date not yet selected.';
        }

        // If both rejection reason and meeting date are not posted
        if (!jobItem.rejectionReason && !jobItem.scheduleMeetingDate) {
          jobItem.rejectionReason = 'In progress, waiting for client.';
          jobItem.scheduleMeetingDate = 'In progress, waiting for update.';
        }
      }
    );

    // Fetch the rejection reason for the job from the Resumes API
    this.jobsint.getRejectionReasonByJobAndName(jobItem.jobId, this.appliedUsername).subscribe(
      (response) => {
        const rejectionReason = response.rejectionReason;
        console.log('Application Rejected:', rejectionReason);
       

        // Update the job object with the rejection reason if it's posted
        if (rejectionReason && rejectionReason !== 'Rejection reason not yet posted.') {
          jobItem.rejectionReason = 'Application Rejected:' + rejectionReason;
          jobItem.scheduleMeetingDate = null; // Clear the meeting date
        }
      },
      (error) => {
        console.error(error);
      }
    );
  });
}
}
