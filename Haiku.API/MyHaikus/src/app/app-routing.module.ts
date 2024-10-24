import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { AddAuthorHaikuComponent } from './features/author-haikus/add-author-haiku/add-author-haiku.component';
import { AllAuthorHaikusComponent } from './features/author-haikus/all-author-haikus/all-author-haikus.component';
import { SingleAuthorHaikuComponent } from './features/author-haikus/single-author-haiku/single-author-haiku.component';
import { UpdateAuthorHaikuComponent } from './features/author-haikus/update-author-haiku/update-author-haiku.component';
import { AddAuthorComponent } from './features/authors/add-author/add-author.component';
import { AllAuthorsComponent } from './features/authors/all-authors/all-authors.component';
import { SingleAuthorComponent } from './features/authors/single-author/single-author.component';
import { UpdateAuthorComponent } from './features/authors/update-author/update-author.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';
import { UpdateProfileComponent } from './features/profile/update-profile/update-profile.component';
import { RegisterComponent } from './features/register/register.component';
import { AddUserHaikuComponent } from './features/user-haikus/add-user-haiku/add-user-haiku.component';
import { AllUserHaikusComponent } from './features/user-haikus/all-user-haikus/all-user-haikus.component';
import { SingleUserHaikuComponent } from './features/user-haikus/single-user-haiku/single-user-haiku.component';
import { UpdateUserHaikuComponent } from './features/user-haikus/update-user-haiku/update-user-haiku.component';
import { AllUsersComponent } from './features/users/all-users/all-users.component';
import { SingleUserComponent } from './features/users/single-user/single-user.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

// Guards
import { AuthenticationGuard } from './core/guards/authentication.guard';
import { AuthorizationGuard } from './core/guards/authorization.guard';
import { UnAuthenticatedGuard } from './core/guards/un-authenticated.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [UnAuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [UnAuthenticatedGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: ['Admin', 'User'] } },

  // Authors
  { path: 'all-authors', component: AllAuthorsComponent },
  { path: 'view-author/:id', component: SingleAuthorComponent },
  { path: 'add-author', component: AddAuthorComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: 'Admin' } },
  { path: 'update-author/:id', component: UpdateAuthorComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: 'Admin' } },

  // Author Haikus
  { path: 'all-author-haikus', component: AllAuthorHaikusComponent },
  { path: 'view-author-haiku/:id', component: SingleAuthorHaikuComponent },
  { path: 'add-author-haiku', component: AddAuthorHaikuComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: 'Admin' } },
  { path: 'update-author-haiku/:id', component: UpdateAuthorHaikuComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: 'Admin' } },

  // Users
  { path: 'all-users', component: AllUsersComponent },
  { path: 'view-user/:id', component: SingleUserComponent },

  // User Profiles
  { path: 'view-profile', component: ProfileComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: ['Admin', 'User'] } },
  { path: 'update-profile', component: UpdateProfileComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: ['Admin', 'User'] } },

  // User Haikus
  { path: 'all-user-haikus', component: AllUserHaikusComponent },
  { path: 'view-user-haiku/:id', component: SingleUserHaikuComponent },
  { path: 'add-user-haiku', component: AddUserHaikuComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: ['Admin', 'User'] } },
  { path: 'update-user-haiku/:id', component: UpdateUserHaikuComponent, canActivate: [AuthenticationGuard, AuthorizationGuard], data: { requiredRole: ['Admin', 'User'] } },

  // Redirects
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
