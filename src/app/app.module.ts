import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponentComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { HttpClientModule } from '@angular/common/http';
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
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loading.interceptor';


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
  ],
  providers: [AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
