import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AppStoreService } from 'src/app/app-store.service';
import { AppliedJobsService } from 'src/app/applied-jobs.service';
import { JobsdetailsService } from 'src/app/jobsdetails.service';
import { Job } from 'src/app/models/job';
import { AuthService } from 'src/app/services/auth.service';
import { AuthnService } from 'src/app/services/authn.service';
import { UserStoreService } from 'src/app/services/user-store.service';
interface HighlightedText {
  text: string;
  highlight: boolean;
}
@Component({
  selector: 'app-app-jobs',
  templateUrl: './app-jobs.component.html',
  styleUrls: ['./app-jobs.component.scss']
})
export class AppJobsComponent implements OnInit {
  jobsList: any[] = [];
  itemsPerPage: number = 12; 
  currentPage: number = 1; 
  totalPages: number = 0; 
  pages: number[] = []; 
  
  
  displayedJobsList: any[] = [];

  showUploadPopupFlag: boolean = false;
 
  resumeData: any = {};
  
  appliedUsername:string='';
id:any;

searchQuery!: string;
searchResults: any[] | null = [];
searchText: string = '';
filteredJobs: Job[] = [];
jobs: any;
hasResults: boolean = true;
recentSearches: any;
userDetails: any;

selectedJob: any; 
  constructor(private router: Router, private toast: NgToastService,private jobsint:JobsdetailsService, private appliedJobsService: AppliedJobsService, private http: HttpClient, private authn:AuthnService, private userStore:AppStoreService) { 
    this.totalPages = Math.ceil(this.jobsList.length / this.itemsPerPage);
    this.generatePageNumbers();
    this.searchQuery = '';
    this.searchResults = [];
    this.filteredJobs = this.jobs;
  }

 


  updateDisplayedJobs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedJobsList = this.jobsList.slice(startIndex, endIndex);

  

  }
  toggleDetails(item: any) {
    item.showDetails = !item.showDetails;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedJobs();
      this.generatePageNumbers(); 
      window.scrollTo(0, 0);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedJobs();
      this.generatePageNumbers(); 
      window.scrollTo(0, 0);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedJobs();
      // this.generatePageNumbers(); 
    }
  }
 
  generatePageNumbers() {
    this.pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      this.pages.push(i);
    }
  }
  
  istrue = false
  ngOnInit(): void {

    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      const fullNameFromToken = this.authn.getfullNameFromToken();
      this.appliedUsername = val || fullNameFromToken

      this.resumeData.name = this.appliedUsername;
    });

    this.jobsint.getmethod(this.appliedUsername).subscribe(data => {
      this.jobsList = data;
      
      this.totalPages = Math.ceil(this.jobsList.length / this.itemsPerPage);
      this.generatePageNumbers();
      this.updateDisplayedJobs();
      this.getUserDetailsByUsername(this.appliedUsername);
      
    });
  }



  getUserDetailsByUsername(appliedUsername: string): void {
    this.jobsint.getUserDetails(this.appliedUsername)
      .subscribe(
        (data) => {
          this.userDetails = data;
         
          this.resumeData.email = this.userDetails?.email;
        },
        (error) => {
          console.error(error);
          this.userDetails = null;
        }
      );
  }
  





saveAndApply() {

  if (!this.resumeData.resumeFile) {
   
    console.log('Please upload your resume before applying.');
    return;
  }


  if (this.selectedJob) {
    
    this.uploadResume();

   
    this.jobsint.postappliedByUser(this.appliedUsername, this.selectedJob).subscribe(
      response => {
        console.log('Applied for the job:', response);
        
        this.toast.success({ detail: "Job applied successfully", duration: 3000 });
        this.selectedJob.ischecked = true; 
       

  
      }
    );
  }
}

  
  
      

       cancelUpload() {
        this.showUploadPopupFlag = false;
       
       }

    

      openUploadPopup(jobId: number) {
        this.showUploadPopupFlag = true;
        this.resumeData.jobId = jobId;
        this.selectedJob = this.jobsList.find(job => job.jobId === jobId); 
      }

      onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.resumeData.resumeFile = file;
      }

      uploadResume() {
        const formData = new FormData();
        formData.append('Name', this.resumeData.name);
        formData.append('Email', this.resumeData.email);
        formData.append('ResumeFile', this.resumeData.resumeFile);
      
        const jobId = this.resumeData.jobId; 
      
        this.http.post(`https://localhost:7058/api/Resumes/${jobId}`, formData)
          .subscribe(
            response => {
             
              console.log('Resume uploaded successfully.');
             



              const jobId = this.resumeData.jobId;
  const jobIndex = this.jobsList.findIndex(job => job.jobId === jobId);
  if (jobIndex !== -1) {
    this.jobsList[jobIndex].resumeUploaded = true;
  }

  // Close the upload popup
  this.showUploadPopupFlag = false;
             
              
            }
          );
      }

      search() {
        this.searchResults = this.jobsList.filter(job => {
          return job.jobTitle.toLowerCase().includes(this.searchText.toLowerCase());
        });
        if (this.searchText && !this.recentSearches.includes(this.searchText)) {
          this.recentSearches.unshift(this.searchText);
        }
        this.searchText = '';
      }
      
      selectResult() {
        if (this.searchResults && this.searchResults.length > 0) {
          const selectedResult = this.searchResults[0];
          
          this.searchQuery = '';
          this.searchResults = null;
        }
      }
      clearSearch() {
        this.searchText = ''; 
        this.filteredJobs = this.jobs; 
        this.hasResults = true;
        console.log('Clear search clicked');
      }

      
      onEnterPressed(event: any) {
        event.preventDefault();
       
        console.log('Enter key pressed');
        this.search();
        if (event.key === 'Enter') {
          this.search(); 
        } 
      }
      highlightSearchText(text: string): string {
        if (!this.searchText || !text) {
          return text;
        }
      
        const searchRegex = new RegExp(this.searchText, 'gi');
        return text.replace(searchRegex, match => `<span class="highlight">${match}</span>`);
      }
      
      highlightText(text: string): HighlightedText[] {
        const highlightedText: HighlightedText[] = [];
      
        if (this.searchText && text) {
          const parts = text.split(new RegExp(`(${this.searchText})`, 'gi'));
      
          parts.forEach(part => {
            if (part.toLowerCase() === this.searchText.toLowerCase()) {
              highlightedText.push({ text: part, highlight: true });
            } else {
              highlightedText.push({ text: part, highlight: false });
            }
          });
        } else {
          highlightedText.push({ text: text, highlight: false });
        }
      
        return highlightedText;
      } 
}
