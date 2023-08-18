import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthnService } from '../services/authn.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class AuthnGuard implements CanActivate {
  constructor(private authn: AuthnService, private router: Router, private toast: NgToastService){

  }
  canActivate():boolean{
    if(this.authn.isLoggedIn()){
      return true
    }else{
      this.toast.error({detail:"ERROR", summary:"Please Login First!"});
      this.router.navigate(['app-login'])
      return false;
    }
  }


}
