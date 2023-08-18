import { Component, OnInit } from '@angular/core';
import { JobsdetailsService } from '../jobsdetails.service';
import { Location } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserStoreService } from '../services/user-store.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';



@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {
  router: any;
username:string = '';

  constructor(private jobsint:JobsdetailsService , private toast: NgToastService,  private formBuilder: FormBuilder,private location: Location, private auth: AuthService, private http:HttpClient, private userStore:UserStoreService) { }
    // jobsList:any
    // istrue = false
  
    jobForm!: FormGroup;
    jobsList: any;
    istrue = false;

      ngOnInit(): void {

        this.initForm();
        this.userStore.getFullNameFromStore()
        .subscribe(val=>{
          const fullNameFromToken = this.auth.getfullNameFromToken();
          this.username = val || fullNameFromToken
        });

      }
      initForm() {
        this.jobForm = this.formBuilder.group({
        
          companyName: ['', [Validators.required, this.alphabeticOnly]],
          jobTitle: ['', [Validators.required, this.alphabeticOnly]],
          experience: ['', Validators.required],
          skills: ['', Validators.required],
          positions: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]], // Ensure a positive integer value
          jobType: ['', Validators.required],
          qualification: ['', Validators.required],
          postedDate: ['', Validators.required],
          endDate: ['', [Validators.required,this.endDateValidator]],
          salary: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]], // Allow only positive numeric values for salary
          location: ['', [Validators.required, this.alphabeticOnly]],
          jobDescription: ['', Validators.required],
          username: ['', Validators.required]
        }, { validators: this.dateComparison });
      }
      postcontact() {
        if (this.jobForm.invalid) {
        
          this.validateAllFormFields(this.jobForm);
          return;
        }
    
        this.jobsint.postmethod(this.jobForm.value).subscribe(
          (result) => {
            this.istrue = true;
            console.log(result);
            this.toast.success({detail:"Job posted successfully", duration: 3000});
           
            setTimeout(() => {
              window.location.reload();
            }, 2000);

          }
        );
      }
    
     
      // Helper function to validate all form fields
      validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
          const control = formGroup.get(field);
          if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          } else {
            if (control) {
              control.markAsDirty();
              control.markAsTouched();
            }
          }
        });
      }
    
      // Custom validator for non-numeric values
      alphabeticOnly(control: AbstractControl): { [key: string]: any } | null {
        const value = control.value;
        if (value && typeof value === 'string' && !/^[a-zA-Z\s]*$/.test(value)) {
          return { alphabeticOnly: true };
        }
        return null;
      }
      endDateValidator(control: AbstractControl): { [key: string]: any } | null {
        const postedDate = control.parent?.get('postedDate')?.value;
        const endDate = control.value;
    
        if (postedDate && endDate && new Date(postedDate) >= new Date(endDate)) {
          return { dateComparison: true };
        }
        return null;
      }
    
      // Getter function to access the endDate control from the HTML template
      get endDateControl() {
        return this.jobForm.get('endDate');
      }
    
      
    
      // Custom validator for comparing postedDate and endDate
      dateComparison(group: FormGroup): { [key: string]: any } | null {
        const postedDate = group.get('postedDate')?.value;
        const endDate = group.get('endDate')?.value;
    
        if (postedDate && endDate && new Date(postedDate) >= new Date(endDate)) {
          return { dateComparison: true };
        }
        return null;
      }
      
    







 

  }

   

    

