import { Component, OnInit } from '@angular/core';
import { BehaviorSubject , Subscription,Observable } from 'rxjs';
import firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserdataService, MainSectionGroup,TestcaseInfo,userProfile,projectFlags } from './service/userdata.service';
import { map, switchMap,filter,take } from 'rxjs/operators';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { doc } from 'rxfire/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ProjectDevelopmentTool';
  subjectauth = new BehaviorSubject(undefined);
  subjectonline = new BehaviorSubject(undefined);
  getObservableauthStateSub:Subscription;
  getObservableonlineSub:Subscription;
  myauth;
  myonline;
  myonlineAfterAuth;
  openDialogSub:Subscription;
  getSectionsSubscription:Subscription;
  getSectionsBehaviourSub= new BehaviorSubject(undefined);
  Sections;
  getSections = (MainAndSubSectionkeys: AngularFirestoreDocument<MainSectionGroup>) => {
    if(this.getSectionsSubscription !== undefined){
      this.getSectionsSubscription.unsubscribe();
    }
    this.getSectionsSubscription= MainAndSubSectionkeys.valueChanges().subscribe((val: any) => {
      console.log('val',val.MainSection);
      this.getSectionsBehaviourSub.next(val.MainSection);
    });
    return this.getSectionsBehaviourSub;
  };
  getTestcasesSubscription:Subscription;
  getTestcasesBehaviourSub= new BehaviorSubject(undefined);
getTestcases = (TestcasList: AngularFirestoreDocument<TestcaseInfo>) => {    
    if(this.getTestcasesSubscription !== undefined){
      this.getTestcasesSubscription.unsubscribe();
    }
    this.getTestcasesSubscription= TestcasList.valueChanges().subscribe((val: any) => {
      let arrayeverse=val;
      if(val !== undefined){
        console.log('val',val.testcase);    
        if(val.testcase === null)    {
          this.getTestcasesBehaviourSub.complete()
        }
        arrayeverse.testcase= val.testcase.reverse();
      }else{
      }
      this.getTestcasesBehaviourSub.next(arrayeverse);
    });
    return this.getTestcasesBehaviourSub;
  };

  getObservableauthState = (authdetails: Observable<firebase.User>) => {

    if(this.getObservableauthStateSub !== undefined){
      this.getObservableauthStateSub.unsubscribe();
    }
    this.getObservableauthStateSub= authdetails.subscribe((val: any) => {     
     this.subjectauth.next(val);
    });
    return this.subjectauth;
  };

  getObservableonine = (localonline: Observable<boolean>) => {    
    this.getObservableonlineSub?.unsubscribe();
    this.getObservableonlineSub= localonline.subscribe((valOnline: any) => {
      this.subjectonline.next(valOnline);
    });
    return this.subjectonline;
  };
  isOnline$: Observable<boolean>;
  loadfirstPageKeysSub:Subscription;

  myprojectFlags: projectFlags = {
    testcasesInSubmenu: undefined,//show add or New Testcase based on number of testcases in subsection
    showPaymentpage: undefined,//for expired user-remove it
    firstTestcaseEdit: false,//showditutton
    showEditTcButton: false,
    homeNewProject: false,
    homeCurrentProject: false,
    editDeleteProject: false,
    editModifyProject: undefined,
    editAddMainsec: false,
    editDeleteMainsec: false,
    editVisibility: false,
    editAddSubSec: false,
    editDeleteSubsec: false
  };

  myuserProfile: userProfile = {
    userAuthenObj: undefined,
    projectOwner: undefined,
    projectLocation: undefined,
    projectName: undefined,
    membershipType: undefined,
    endMembershipValidity: undefined,
    mainsubsectionKeys: undefined,
    publicProjectData: undefined,
    ownPublicprojectData: undefined,
    MainSectionData: undefined,
    SubSectionData: undefined,
    ownPublicproject: []
  };
  constructor(
    public afAuth: AngularFireAuth,
    public developmentservice:UserdataService,
    private db: AngularFirestore
    ) {
      this.myauth = this.getObservableauthState(this.afAuth.authState);
      this.myonline = this.getObservableonine(this.developmentservice.isOnline$);
      this.myonlineAfterAuth= this.myonline.pipe(
        switchMap((onlineval:any)=>{
          return this.myauth.pipe(    
            filter(authstat=> authstat !== undefined),        
            map((myauthentication:firebase.User)=> {
              if(myauthentication === null){// loggoff
              }else{ //logged In            
              //read tc
              this.myuserProfile.userAuthenObj = myauthentication;
              this.myuserProfile.projectLocation= 'projectList/DemoProjectKey';
              this.loadFirstPageKeys();
              //read keys
            }
              return onlineval;      
          }))
        })        
      );
    }
    loadFirstPageKeys(){
      console.log('this.loadfirstPageKeysSub', this.loadfirstPageKeysSub);
      if(this.loadfirstPageKeysSub !== undefined){
        this.loadfirstPageKeysSub.unsubscribe();
      }
      this.loadfirstPageKeysSub= doc(this.db.firestore.doc('/myProfile/' + this.myuserProfile.userAuthenObj.uid))
      .pipe(take(1),
         map((profileData:any)=>{
        if (profileData.data() !== undefined) {//norecords
          if (new Date(profileData.data().MembershipEnd).valueOf() < new Date().valueOf()) {
            if (profileData.data().MembershipType === 'Demo') {//expired
              this.myuserProfile.projectOwner = false;//cannot add tc
              this.myuserProfile.projectName = 'Demo';
              this.myuserProfile.projectLocation = '/projectList/DemoProjectKey';
              this.myuserProfile.membershipType = 'Demo';
              this.myuserProfile.endMembershipValidity = new Date(profileData.data().MembershipEnd);
              this.myprojectFlags.showPaymentpage = true;// show only payments Page
            } else {//expired member
              const nextMonth: Date = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              const newItem = {
                MembershipEnd: nextMonth.toDateString(),
                MembershipType: 'Demo',
                projectLocation: '/projectList/DemoProjectKey',
                projectOwner: true,
                projectName: 'Demo'
              };
              this.db.doc<any>('myProfile/' + this.myuserProfile.userAuthenObj.uid).set(newItem);
              this.myuserProfile.projectOwner = true;
              this.myuserProfile.projectName = 'Demo';
              this.myuserProfile.projectLocation = '/projectList/DemoProjectKey';
              this.myuserProfile.membershipType = 'Demo';
              this.myuserProfile.endMembershipValidity = new Date(nextMonth.toDateString());
              this.myprojectFlags.showPaymentpage = false;
            }  
          } else {//start normal
            this.myuserProfile.projectName = profileData.data().projectName;
            this.myuserProfile.projectOwner = profileData.data().projectOwner;
            this.myuserProfile.projectLocation = profileData.data().projectLocation;
            this.myuserProfile.membershipType = profileData.data().MembershipType;
            this.myuserProfile.endMembershipValidity = new Date(profileData.data().MembershipEnd);
            this.myprojectFlags.showPaymentpage = false;
          }//end normal
        }//end demo/Member        
      this.Sections= this.getSections(this.db.doc(this.myuserProfile.projectLocation));
      })//end map-profileData
      ).subscribe(_=>{

      });
    }
    ngOnInit() {
    }
    componentLogOff() {
      this.developmentservice.logout();
      this.openDialogSub?.unsubscribe();
}
}