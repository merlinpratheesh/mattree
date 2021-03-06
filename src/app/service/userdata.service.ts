import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { Observable,Subscription } from 'rxjs';
import { of, merge, fromEvent } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { FormControl,FormGroup} from '@angular/forms'

export interface projectSub{
  publicprojectControlSub:Subscription;
  ownPublicprojectControlSub:Subscription;
  editMainsectionGroupSub:Subscription;
  editSubsectionGroupSub:Subscription;
  loadFirstPageTcSub:Subscription;
  loadfirstPageKeysSub:Subscription;
}
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
  keysReadFromDb?:MainSectionGroup[];
  mainsubsectionKeys?: string[];
  subSectionKeys?:string[];
  savedisabledval?:boolean;
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

export interface projectControls{
  subsectionkeysControl: FormControl;//1-Keys come from db and user sub-sec selection will load a doc from demo or public proj
  testcaseInfoControl: FormControl; //Displays the selected Testcase details
  createTestcaseControl: FormControl;//User enters a test case name
  publicprojectControl: FormControl;//1-User selects a public project    
  ownPublicprojectControl: FormControl;//1-User selects own public project
  editMainsectionGroup: FormGroup;// user selects a Main section key
  visibilityMainsectionGroup:FormGroup,
  editSubsectionGroup: FormGroup;  // user selects a Sub section key
}
export interface projectVariables
{
    initialMainSection?:string;
    viewSelectedTestcase?:TestcaseInfo;
    testcaseInfodata?: Observable<TestcaseInfo[]>;
    modifiedKeysDb?:TestcaseInfo[];
    editProjectkeysSaved:MainSectionGroup[];
    lastSavedVisibility:boolean;
}
export interface myusrinfo{
  MembershipEnd:string;
  MembershipType:string;
  projectLocation:string;
  projectName:string;
  projectOwner:string;
}
@Injectable({
  providedIn: 'root'
})

export class UserdataService {
  isOnline$: Observable<boolean>;

  constructor(
    public auth: AngularFireAuth,private db: AngularFirestore
  ) { 
    this.isOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }
  login() {
    return this.auth.signInWithRedirect( new (firebase.auth as any).GoogleAuthProvider()).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      if (errorCode === 'auth/popup-closed-by-user' || errorCode === 'auth/network-request-failed'){
        
        //alert('Check Internet Connection');
        location.reload();
      }
    });
  }
  logout() {
    return this.auth.signOut();
  }
  docExists() {
    return this.db.doc(`projectList/DemoProjectKey`).valueChanges().pipe(first()).toPromise();
  }
}
