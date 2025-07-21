import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { ResponseComponent } from './response/response.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { CreatepostsComponent } from './createposts/createposts.component';
import { DisplaypostsComponent } from './displayposts/displayposts.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { InputandoutputComponent } from './inputandoutput/inputandoutput.component';
import { ButtonoutputComponent } from './buttonoutput/buttonoutput.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { ChatsComponent } from './chats/chats.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingInterceptor } from './loading.interceptor';
import { authReducer } from './auth.reducer'; // Ensure this path is correct
import { AuthService } from './auth.service';
import { userReducer } from './auth.reducer';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';


import { environment } from './environment';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    SignupComponent,
    ResponseComponent,
    MyaccountComponent,
    CreatepostsComponent,
    DisplaypostsComponent,
    LoginFormComponent,
    InputandoutputComponent,
    ButtonoutputComponent,
    EditPostComponent,
    ChatsComponent,
    SpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    StoreModule.forRoot({ auth: authReducer, user: userReducer }), // Register the reducer
    StoreDevtoolsModule.instrument({ maxAge: 25 }), // Optional: for debugging

    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
