import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ResumeViewModel {
  resumeId:number;
  applicantName: string;
  applicantEmail: string;
  resumeFileName: string;
  resumeFileData: string; // This will be a base64 encoded string
  rejectionReason: string; // Add this property to support rejectionReason
  scheduleMeetingDate: Date; // Add this property to support scheduleMeetingDate
  jobId: number;
  status:string
  statusInput?: string;
  isStatusSelected: boolean;
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
  salary:number;
  endDate:string;
  positions:number;
  qualification:string;
  jobDescription: string;
  resumes: ResumeViewModel[];
  showResumes?: boolean; 
  statusInput?: string;
}
@Injectable({
  providedIn: 'root'
})
export class JobsdetailsService {
  selectedJob: any;

  constructor(private http:HttpClient) { }



Url = 'https://localhost:7058/api/Jobs';
applicantUrl = "https://localhost:7058/api/applicant";
applyjobsurl = "https://localhost:7058/api/Applied/ApplyForJob";
getappliedurl = "https://localhost:7058/api/Applied/AppliedJobs";


getbyuser ="https://localhost:7058";

resumeuploadUrl="https://localhost:7058/api/ResumeClass";

statusget = "https://localhost:7058/api/Resumes/";


userUrl= 'https://localhost:7058/api/Applicant';

getmethod(appliedUsername: string): Observable<any>{
  const url = `${this.getbyuser}/api/Jobs/Jobs?appliedUsername=${appliedUsername}`;
  return this.http.get<any>(url)
}

getJobsByUser(username: string) {
  
  const url = `${this.getbyuser}/api/Jobs?username=${username}`;
  return this.http.get<any[]>(url);
}



postappliedByUser(appliedusername: string, data: any): Observable<any[]> {
  const url = `${this.getbyuser}/api/Applied/ApplyForJob/${appliedusername}`;

  const requestBody = {
    JobsObj: data,
    AppliedUsername: appliedusername
  };

  return this.http.post<any[]>(url, requestBody);
}

getAppliedJobsByUser(appliedUsername: string): Observable<any[]> {
  const url = `${this.getbyuser}/api/Applied/GetJobsByUser/${appliedUsername}`;
  return this.http.get<any[]>(url);
}

postmethod(data: any) {
  
  return this.http.post(this.Url,data);
}

//client jobs edit method
editmethod(jobId: number, data: any): Observable<any> {
  const editurl = `https://localhost:7058/api/Jobs/editjobsdata/${jobId}`;
  return this.http.put(editurl, data);
}


getapplicant(): Observable<any>{
  return this.http.get<any>(this.applicantUrl)
}



getapplied(){
  return this.http.get(this.getappliedurl)
}


getResume(id: number): Observable<any> {
  const url = `https://localhost:7058/api/ResumeClass/${id}`;
  return this.http.get(url);
}

downloadResume(resumeId: number):  Observable<Blob>{
  const resumeGetUrl = `${this.resumeuploadUrl}/${resumeId}`;

    return this.http.get(resumeGetUrl, { responseType: 'blob' });
}




deletemethod(jobId: number){
  const deleteurl = `https://localhost:7058/api/Jobs/deletejobsdata/${jobId}`;
  return this.http.delete(deleteurl)
}

uploadResume(file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(this.resumeuploadUrl, formData);
}




getResumes(username:string): Observable<JobResumeViewModel[]> {
  const url = `${this.getbyuser}/api/Resumes?username=${username}`;
  return this.http.get<JobResumeViewModel[]>(url);
}


getScheduleMeetingMessage(resumeId: number): Observable<string> {
  const url = `${this.statusget}${resumeId}/ScheduleMeeting`;
  return this.http.get<string>(url);
}

getRejectionMessage(resumeId: number): Observable<string> {
  const url = `${this.statusget}${resumeId}/Reject`;
  return this.http.get<string>(url);
}



getScheduleMeetingDateByJobAndName(jobId: number, name: string): Observable<any> {
  const url = `${this.statusget}GetScheduleMeetingDateByJobAndName?jobId=${jobId}&name=${name}`;
  return this.http.get<any>(url);
}

getRejectionReasonByJobAndName(jobId: number, name: string): Observable<any> {
  const url = `${this.statusget}GetRejectionReasonByJobAndName?jobId=${jobId}&name=${name}`;
  return this.http.get<any>(url);
}


getUserDetails(username: string): Observable<any> {
  const url = `${this.userUrl}/userdetails/${username}`;
  return this.http.get(url);
}


}
