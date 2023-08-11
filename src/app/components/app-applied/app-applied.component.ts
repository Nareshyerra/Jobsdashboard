import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';

import { JobsdetailsService } from 'src/app/jobsdetails.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthnService } from 'src/app/services/authn.service';
import { UserStoreService } from 'src/app/services/user-store.service';
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
  constructor(private jobsint: JobsdetailsService, private authn:AuthnService, private userStore:AppStoreService) {
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

viewJobDetails(jobId: number) {
  console.log('Clicked JobId:', jobId);

  // Set the clicked job
  this.clickedJobId = jobId;

  const jobItem = this.displayedAppliedJobs.find(item => item.jobId === jobId);

  if (jobItem) {
    // Fetch the schedule meeting date for the clicked job from the Resumes API
    this.jobsint.getScheduleMeetingDateByJobAndName(jobId, this.appliedUsername).subscribe(
      (scheduleMeetingDate) => {
       

        // Update the job object with the schedule meeting date if it's available
        if (scheduleMeetingDate) {
          jobItem.scheduleMeetingDate ='Interview is scheduled on: ' + scheduleMeetingDate;
          jobItem.rejectionReason = null; // Clear the rejection reason
        } else {
          jobItem.scheduleMeetingDate = 'Meeting date not yet selected.';
        }
      }
   
    );

    // Fetch the rejection reason for the clicked job from the Resumes API
    this.jobsint.getRejectionReasonByJobAndName(jobId, this.appliedUsername).subscribe(
      (response) => {
        const rejectionReason = response.rejectionReason;
        console.log('Application Rejected:', rejectionReason);

        // Update the job object with the rejection reason if it's posted
        if (rejectionReason && rejectionReason !== 'Rejection reason not yet posted.') {
          jobItem.rejectionReason ='Application Rejected:'+ rejectionReason;
          jobItem.scheduleMeetingDate = null; // Clear the meeting date
        } else {
          jobItem.rejectionReason = null; // Clear the rejection reason
        }
      },
      (error) => {
        console.error(error);
      }
    );

    // Show "In progress, waiting for client." message if both rejection reason and meeting date are not posted
    if (!jobItem.rejectionReason && !jobItem.scheduleMeetingDate) {
      jobItem.rejectionReason = 'In progress, waiting for client.';
      jobItem.scheduleMeetingDate = 'In progress, waiting for update.'; // Clear the meeting date
    } else {
      // Clear the waiting message if either the rejection reason or the meeting date is posted
      jobItem.rejectionReason = null;
    }

    // Hide status message if either rejection reason or meeting date is posted
    if (jobItem.rejectionReason || jobItem.scheduleMeetingDate) {
      this.showStatusMessage = true;
    } else {
      this.showStatusMessage = false;
    }
  }
}


}
