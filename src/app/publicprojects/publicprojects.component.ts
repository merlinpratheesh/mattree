import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormControl, Validators } from '@angular/forms';
import firebase from 'firebase/app';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, startWith, withLatestFrom, take } from 'rxjs/operators';
import { projectControls, UserdataService, userProfile } from '../service/userdata.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {ChangeDetectionStrategy} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { doc } from 'rxfire/firestore';

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
  
  publicProjectData: Observable<any[]>;
 

  constructor(    public developmentservice: UserdataService,private db: AngularFirestore) { }
  publicProjsel:Subscription;

  ngOnInit(): void {
    this.myuserProfile.userAuthenObj=this.profileinfoUid;
  }
  publicprojectsList:any;
  ngAfterViewInit()
  {
    this.publicProjectData = doc(this.db.firestore.doc('/projectList/publicProjects')).pipe(take(1),
      switchMap((val: any) => {
        let publicprojectsList = [];
        if (val.data() !== undefined) {//always have one public project
          publicprojectsList = val.data().public;
          //}          
        } 
          return this.myprojectControls.publicprojectControl.valueChanges.pipe(
            startWith(''),
            map((some: string) => {
              //console.log('467',publicprojectsList );
              
         
              return publicprojectsList;
            })
          );
      })
    );

  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.publicprojectsList, event.previousIndex, event.currentIndex);
  }
  ngOnDestroy(){
  }

}
