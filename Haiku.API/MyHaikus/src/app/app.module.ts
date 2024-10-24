import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CookieService } from 'ngx-cookie-service';
import { AppRoutingModule } from './app-routing.module';

// App Components
import { AppComponent } from './app.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

// Login and Registration
import { LoginFormComponent } from './features/login/login-form/login-form.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterFormComponent } from './features/register/register-form/register-form.component';
import { RegisterComponent } from './features/register/register.component';

// User Profile
import { ProfileComponent } from './features/profile/profile.component';
import { UpdateProfileFormComponent } from './features/profile/update-profile/update-profile-form/update-profile-form.component';
import { UpdateProfileComponent } from './features/profile/update-profile/update-profile.component';

// Author Components
import { AddAuthorFormComponent } from './features/authors/add-author/add-author-form/add-author-form.component';
import { AddAuthorComponent } from './features/authors/add-author/add-author.component';
import { AllAuthorsComponent } from './features/authors/all-authors/all-authors.component';
import { SingleAuthorComponent } from './features/authors/single-author/single-author.component';
import { UpdateAuthorFormComponent } from './features/authors/update-author/update-author-form/update-author-form.component';
import { UpdateAuthorComponent } from './features/authors/update-author/update-author.component';

// Author Haikus
import { AddAuthorHaikuFormComponent } from './features/author-haikus/add-author-haiku/add-author-haiku-form/add-author-haiku-form.component';
import { AddAuthorHaikuComponent } from './features/author-haikus/add-author-haiku/add-author-haiku.component';
import { AllAuthorHaikusComponent } from './features/author-haikus/all-author-haikus/all-author-haikus.component';
import { SingleAuthorHaikuComponent } from './features/author-haikus/single-author-haiku/single-author-haiku.component';
import { UpdateAuthorHaikuFormComponent } from './features/author-haikus/update-author-haiku/update-author-haiku-form/update-author-haiku-form.component';
import { UpdateAuthorHaikuComponent } from './features/author-haikus/update-author-haiku/update-author-haiku.component';

// User Components
import { AllUsersComponent } from './features/users/all-users/all-users.component';
import { SingleUserComponent } from './features/users/single-user/single-user.component';

// User Haikus
import { AddUserHaikuFormComponent } from './features/user-haikus/add-user-haiku/add-user-haiku-form/add-user-haiku-form.component';
import { AddUserHaikuComponent } from './features/user-haikus/add-user-haiku/add-user-haiku.component';
import { AllUserHaikusComponent } from './features/user-haikus/all-user-haikus/all-user-haikus.component';
import { SingleUserHaikuComponent } from './features/user-haikus/single-user-haiku/single-user-haiku.component';
import { UpdateUserHaikuFormComponent } from './features/user-haikus/update-user-haiku/update-user-haiku-form/update-user-haiku-form.component';
import { UpdateUserHaikuComponent } from './features/user-haikus/update-user-haiku/update-user-haiku.component';

// Directives
import { IsUnAuthenticatedDirective } from './shared/directives/is-unauthenticated.directive';
import { IsAuthorizedDirective } from './shared/directives/is-authorized.directive';

// Interceptors
import { AuthorizationInterceptor } from './core/utilities/authorizationInterceptor';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,

    // Login and Registration
    LoginComponent,
    LoginFormComponent,
    RegisterComponent,
    RegisterFormComponent,

    // User Profile
    ProfileComponent,
    UpdateProfileComponent,
    UpdateProfileFormComponent,

    // Author Components
    AllAuthorsComponent,
    SingleAuthorComponent,
    AddAuthorComponent,
    AddAuthorFormComponent,
    UpdateAuthorComponent,
    UpdateAuthorFormComponent,

    // Author Haikus
    AllAuthorHaikusComponent,
    SingleAuthorHaikuComponent,
    AddAuthorHaikuComponent,
    AddAuthorHaikuFormComponent,
    UpdateAuthorHaikuComponent,
    UpdateAuthorHaikuFormComponent,

    // User Components
    AllUsersComponent,
    SingleUserComponent,

    // User Haikus
    AllUserHaikusComponent,
    SingleUserHaikuComponent,
    AddUserHaikuComponent,
    AddUserHaikuFormComponent,
    UpdateUserHaikuComponent,
    UpdateUserHaikuFormComponent,

    // Directives
    IsAuthorizedDirective,
    IsUnAuthenticatedDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    NgbModule 
  ],
  exports: [
    IsAuthorizedDirective,
    IsUnAuthenticatedDirective,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
