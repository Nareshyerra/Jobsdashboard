import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppStoreService } from 'src/app/app-store.service';
import { AppliedJobsService } from 'src/app/applied-jobs.service';
import { JobsdetailsService } from 'src/app/jobsdetails.service';
import { AuthnService } from 'src/app/services/authn.service';

interface Message {

  author: string;

  content: string;

}

@Component({
  selector: 'app-app-home',
  templateUrl: './app-home.component.html',
  styleUrls: ['./app-home.component.scss']
})


export class AppHomeComponent implements OnInit {

  images: string[] = [
    'assets/career.jpg',
    'assets/Jobs.jpg',
    'assets/Register.jpg'
  ];
  currentImage: string | undefined;


  profileId!: number;
  firstName!: string;
  lastName!: string;
  email!: string; 
  mobile!: string;
  resume!: File;


  //Testimonilas
  testimonials = [
    { 
      profilePhoto: 'assets/Profile pht.jpg',
      name: 'Naresh',
      content: "I cannot express enough gratitude for the jobs portal. It revolutionized my job search experience. "
    },
    { 
      profilePhoto: 'assets/Anjali.png',
      name: 'Anjali',
      content: "The jobs portal exceeded my expectations in every way possible. Its very great platform. " 
    },
    { 
      profilePhoto: 'assets/rizwana.png',
      name: 'Rizwana',
      content: "I'm very glad to get placed from Onlinejobsportal to Dell EMC corporation. I got placed just at my very less time.." 
    },
    { 
      profilePhoto: 'assets/chandra.png',
      name: 'Chandra',
      content: 'Iam very thankful to jobs portal.It Is a very good and geniune platform for freshers to find jobs...' 
    },
    { 
      profilePhoto: 'assets/prakyath.png',
      name: 'Prakhyath',
      content: "I had a great experience using the jobs portal to find my next career move..."  
    },
    { 
      profilePhoto: 'assets/soumya.png',
      name: 'Soumya',
      content: 'I am very grateful to them for effectively and sincerely helping me to grab first ever job opportunity' 
    },
    { 
      profilePhoto: 'assets/Madhu.png',
      name: 'Madhu',
      content: 'Thank you onlinejobsportal for providing multiple opportunties in number of companies where I got place placed' 
    },
    { 
      profilePhoto: 'assets/srimathi.png',
      name: 'srimathi',
      content: 'I am extremely grateful to the jobs portal for helping me secure my dream job...' 
    },
    { 
      profilePhoto: 'assets/mounika.png',
      name: 'Mounika',
      content: "I have been searching for a job for months without any luck until I discovered the jobs portal."
    },
    { 
      profilePhoto: 'assets/priyanka.png',
      name: 'Priyanka',
      content: "I can't thank the jobs portal enough for the fantastic opportunities" 
    },
   
    { 
      profilePhoto: 'assets/sandhya.pic.png',
      name: 'sandhya',
      content: "I had been struggling to find a job that matched my qualifications until I stumbled upon the jobs portal.."
    }
  ];




  //pagination and geting jobs
  currentSlideIndex = 0;
  jobsList: any[] = [];
  itemsPerPage: number = 4; 
  currentPage: number = 1; 
  totalPages: number = 0; 
  pages: number[] = []; 
  
  displayedJobsList: any[] = [];
  appliedUsername:string='';
  constructor(private jobsint:JobsdetailsService, private appliedJobsService: AppliedJobsService, private http: HttpClient, private userStore:AppStoreService, private authn:AuthnService) { 
    this.totalPages = Math.ceil(this.jobsList.length / this.itemsPerPage);
    this.generatePageNumbers();
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
    });



    this.jobsint.getmethod(this.appliedUsername).subscribe(data => {
      this.jobsList = data;
      
      this.totalPages = Math.ceil(this.jobsList.length / this.itemsPerPage);
      this.generatePageNumbers();
      this.updateDisplayedJobs();
    

      
    });


    setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.testimonials.length;
    }, 6000); 


  }


  

}
