import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { map, switchMap, startWith, withLatestFrom } from 'rxjs/operators';
import { projectControls, UserdataService, userProfile } from '../service/userdata.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-privateprojects',
  templateUrl: './privateprojects.component.html',
  styleUrls: ['./privateprojects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class PrivateprojectsComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @Input() profileinfoUid: firebase.User;

  myprojectControls: projectControls = {
    PrivateprojectControl: new FormControl(null, Validators.required)
  };
  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success
  
  };

  privateList = of(undefined);
  localprivateList = [];
  getPrivateListSubscription: Subscription;
  getPrivateListBehaviourSub = new BehaviorSubject(undefined);
  getPrivateList = (privateProjects: AngularFirestoreDocument<any>) => {
    if (this.getPrivateListSubscription !== undefined) {
      this.getPrivateListSubscription.unsubscribe();
    }
    this.getPrivateListSubscription = privateProjects.valueChanges().subscribe((val: any) => {
      console.log('val', val);
      if (val === undefined) {
        this.getPrivateListBehaviourSub.next(undefined);
      } else {
        if (val.ownerRecord.length === 0) {
          this.getPrivateListBehaviourSub.next(null);
        } else {
          this.localprivateList = val.ownerRecord;
          this.getPrivateListBehaviourSub.next(val.ownerRecord);
        }
      }
    });
    return this.getPrivateListBehaviourSub;
  };

  constructor(    public developmentservice: UserdataService,private db: AngularFirestore) { }
  privateview:Subscription;

  ngOnInit(): void {
    //this.myuserProfile.userAuthenObj=this.profileinfoUid;
  }

  ngAfterViewInit(){
    this.myuserProfile.userAuthenObj=this.profileinfoUid;
    console.log(this.profileinfoUid);

    this.privateview = this.myprojectControls.PrivateprojectControl.valueChanges.pipe(
      startWith(''),
      map((privateProjectSelected: string) => {

        this.privateList = this.getPrivateList(this.db.doc(('/projectList/' + this.myuserProfile.userAuthenObj.uid)));
        console.log(this.privateList);


      })).subscribe(_=>{

      });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.localprivateList, event.previousIndex, event.currentIndex);
  }

  ngOnDestroy(){
    this.privateview.unsubscribe();
    this.getPrivateListSubscription?.unsubscribe();
  }

}
