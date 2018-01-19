import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';



export const firebaseConfig = {
    apiKey: "AIzaSyAZcWxuMz4yBw4T9KN9KF-juMYw-kLakT0",
    authDomain: "ng-notas-ab9b0.firebaseapp.com",
    databaseURL: "https://ng-notas-ab9b0.firebaseio.com",
    storageBucket: "ng-notas-ab9b0.appspot.com",
    messagingSenderId: "1022420727476"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
