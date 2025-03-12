import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignupComponent } from './signup/signup.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { CreatepostsComponent } from './createposts/createposts.component';
import { DisplaypostsComponent } from './displayposts/displayposts.component';
import { Authgaurd } from './auth.gaurd';
import { LoginFormComponent } from './login-form/login-form.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { ChatsComponent } from './chats/chats.component';

const routes: Routes = [
  { path: 'login', component: LoginComponentComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [Authgaurd],
  },
  { path: 'signup', component: SignupComponent },
  {
    path: 'myaccount',
    component: MyaccountComponent,
    canActivate: [Authgaurd],
  },
  {
    path: 'createposts',
    component: CreatepostsComponent,
    canActivate: [Authgaurd],
  },
  { path: 'posts', component: DisplaypostsComponent, canActivate: [Authgaurd] },
  {path:'editpost', component:EditPostComponent, canActivate:[Authgaurd]},
  { path: 'loginForm', component: LoginFormComponent },
  {path: 'chats', component:ChatsComponent,  canActivate:[Authgaurd]},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
