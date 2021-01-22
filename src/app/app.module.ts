import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent} from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppSharedModule } from './app-shared/app-shared.module';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { PublicprojectsComponent } from './publicprojects/publicprojects.component';
import { PrivateprojectsComponent } from './privateprojects/privateprojects.component';
import { firebase, firebaseui, FirebaseUIModule } from "firebaseui-angular";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";


const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      clientId:"1075525420003-393vor4371dr05rlou9890vf8hv8m7p4.apps.googleusercontent.com",  
    }
  ],
 tosUrl: '<verifytesttool.firebaseapp.com>',
        privacyPolicyUrl: function() {
          window.location.assign('<verifytesttool.firebaseapp.com>');
        },
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
  
}
@NgModule({
  declarations: [
    AppComponent,
    PublicprojectsComponent,
    PrivateprojectsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppSharedModule,
    AngularFireModule.initializeApp(environment.firebaseconfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    AngularFireModule.initializeApp(environment.firebaseconfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)

  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
