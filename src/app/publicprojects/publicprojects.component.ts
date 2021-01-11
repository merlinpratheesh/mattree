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

@Component({
  selector: 'app-publicprojects',
  templateUrl: './publicprojects.component.html',
  styleUrls: ['./publicprojects.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class PublicprojectsComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  @Input() profileinfoUid: firebase.User;
  myprojectControls: projectControls = {
    publicprojectControl: new FormControl(null, Validators.required)
  };
  myuserProfile: userProfile = {
    userAuthenObj: null,//Receive User obj after login success
  
  };
  publicList = of(undefined);
  localpublicList = [];
  getPublicListSubscription: Subscription;
  getPublicListBehaviourSub = new BehaviorSubject(undefined);
  getPublicList = (publicProjects: AngularFirestoreDocument<any>) => {
    if (this.getPublicListSubscription !== undefined) {
      this.getPublicListSubscription.unsubscribe();
    }
    this.getPublicListSubscription = publicProjects.valueChanges().subscribe((val: any) => {
      if (val === undefined) {
        this.getPublicListBehaviourSub.next(undefined);
      } else {
        if (val.public.length === 0) {
          this.getPublicListBehaviourSub.next(null);
        } else {
          this.localpublicList = val.public;
          this.getPublicListBehaviourSub.next(val.public);
        }
      }
    });
    return this.getPublicListBehaviourSub;
  };

  constructor(    public developmentservice: UserdataService,private db: AngularFirestore) { }
  publicProjsel:Subscription;

  ngOnInit(): void {
    this.myuserProfile.userAuthenObj=this.profileinfoUid;
  }
  ngAfterViewInit(){
    this.publicProjsel = this.myprojectControls.publicprojectControl.valueChanges.pipe(
      startWith(''),
      map((publicProjectSelected: string) => {
        if (!publicProjectSelected || publicProjectSelected === '') {
          this.localpublicList = [];
          this.getPublicListSubscription?.unsubscribe();
          this.publicList = this.getPublicList(this.db.doc(('/projectList/publicProjects')));    
          return publicProjectSelected;
        }
      })).subscribe(_=>{

      });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.localpublicList, event.previousIndex, event.currentIndex);
  }
  ngOnDestroy(){
    this.publicProjsel.unsubscribe();
    this.getPublicListSubscription?.unsubscribe();
  }

}
