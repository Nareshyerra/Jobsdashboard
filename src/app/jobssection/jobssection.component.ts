import { Component, OnInit } from '@angular/core';
import { JobsdetailsService } from '../jobsdetails.service';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { UserStoreService } from '../services/user-store.service';
import { NgToastService } from 'ng-angular-popup';
import { CommonModule } from '@angular/common';
import { Job } from '../models/job';
import { HighlightPipePipe } from '../highlight-pipe.pipe';
import { FilterPipe } from '../filter.pipe';
interface HighlightedText {
  text: string;
  highlight: boolean;
}

@Component({
  selector: 'app-jobssection',
  templateUrl: './jobssection.component.html',
  providers: [HighlightPipePipe, FilterPipe],
  styleUrls: ['./jobssection.component.scss']
})
export class JobssectionComponent implements OnInit {

  jobsList: any[] = [];
  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalPages: number = 0;
  pages: number[] = [];
  displayedJobsList: any[] = [];
  selectedJob: any = {};

  searchQuery!: string;
  searchResults: any[] | null = [];
  searchText: string = '';
  filteredJobs: Job[] = [];
  jobs: any;
  recentSearches: any;

  showEditFormFlag = false;
  hasResults: boolean = true;

 
 
  userId: number | undefined;
  username: string = '';
  constructor( private toast: NgToastService,private jobsint:JobsdetailsService , private location: Location, private auth:AuthService, private userStore: UserStoreService) { 
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
      this.generatePageNumbers(); 
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
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.username = val || fullNameFromToken
    });

    if (this.username) {
      this.jobsint.getJobsByUser(this.username).subscribe(data => {
        this.jobsList = data;
        this.totalPages = Math.ceil(this.jobsList.length / this.itemsPerPage);
        this.generatePageNumbers();
        this.updateDisplayedJobs();
      });
    }

  }
  

  showEditForm(job: any) {
    this.selectedJob = { ...job }; 
    this.showEditFormFlag = true;
  }
 
  hideEditForm(): void {
    this.showEditFormFlag = false;
  }

  cancelEditForm(): void {
    this.showEditFormFlag = false;

  }




onSubmit() {
  this.jobsint.editmethod(this.selectedJob.jobId, this.selectedJob).subscribe(
    (response) => {

      this.toast.success({detail:"updated successfully", duration: 3000});
    

      this.hideEditForm(); // Hide the edit form after successful update
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  );
}

delete(jobId:number){
 
  this.jobsint.deletemethod(jobId).subscribe(
    (response) =>{
     
      this.toast.success({detail:"Deleted successfully", duration: 3000});
     
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  )
}


search() {
  this.searchResults = this.jobsList.filter(job => {
    return job.jobTitle.toLowerCase().includes(this.searchText.toLowerCase());
  });

  this.hasResults = this.searchResults.length > 0;

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
  this.searchText = ''; // Clear the search text
  this.filteredJobs = this.jobs; // Reset the filtered jobs to show all jobs
  this.hasResults = true;
  console.log('Clear search clicked');
}
onEnterPressed(event: any) {
  event.preventDefault();
 
  console.log('Enter key pressed');
  this.search();
  if (event.key === 'Enter') {
    this.search(); // Call the search function when Enter is pressed
  } // Call the search method on enter key press
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





