import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { of, merge, fromEvent } from 'rxjs';
import { map} from 'rxjs/operators';

export interface projectFlags
{    
    testcasesInSubmenu:boolean;//show add or New Testcase based on number of testcases in subsection
    showPaymentpage:boolean;//for expired user-remove it
    firstTestcaseEdit:boolean;
    showEditTcButton:boolean;
    homeNewProject:boolean;
    homeCurrentProject:boolean;
    editDeleteProject:boolean;
    editModifyProject:boolean;
    editAddMainsec:boolean;
    editDeleteMainsec:boolean;
    editVisibility:boolean;//visibility button
    editAddSubSec:boolean;
    editDeleteSubsec:boolean;
    
}
export interface userProfile { 
  userAuthenObj: firebase.User,//Receive User obj after login success
  projectLocation?:string;//Demo or User public project ref
  projectOwner?:boolean;
  projectName?:string
  membershipType?:string;
  endMembershipValidity?:Date;
  mainsubsectionKeys?: Observable<MainSectionGroup[]>;
  publicProjectData?: Observable<string[]>;
  ownPublicprojectData?: Observable<string[]>;
  MainSectionData?: Observable<string[]>;
  SubSectionData?: string[];
  ownPublicproject?: string[];
 }

export interface SubSection {
  viewvalue: string;
}

export interface TestcaseInfo{
  heading: string;//Heading in testcase list
  subHeading:string;//Sub-Heading in testcase list
  description: string;//Description in testcase view
  linktoTest: string;//stackblitzLink in testcase edit/doubleclick
}

export interface MainSectionGroup {
  disabled: boolean;
  name: string;
  section: SubSection[];
}

@Injectable({
  providedIn: 'root'
})

export class UserdataService {
  isOnline$: Observable<boolean>;

  constructor(
    public auth: AngularFireAuth
  ) { 
    this.isOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }
  login() {
    return this.auth.signInWithPopup( new (firebase.auth as any).GoogleAuthProvider()).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/network-request-failed'){
        alert('Check Internet Connection');
      }
    });
  }
  logout() {
    return this.auth.signOut();
  }
}
