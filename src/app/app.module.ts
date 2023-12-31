import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { LoginModule } from './modules/login/login.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import {
  GoogleInitOptions,
  GoogleLoginProvider,
  SocialAuthServiceConfig,
  SocialLoginModule
} from '@abacritt/angularx-social-login';
import { FormsModule } from '@angular/forms';
import { LayoutModule } from './modules/layout/layout.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationService } from './services/location.service';
import { AuthService } from './services/auth.service';
import { OpenStreetService } from './services/openstreet.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SocialLoginModule,
    AngularFireAuthModule,
    LoginModule,
    DashboardModule,
    LayoutModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      enableHtml: true
    })
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.google.clientId, {
              oneTapEnabled: false, // default is true
              scopes: [
                'https://www.googleapis.com/auth/photoslibrary.readonly',
                'https://www.googleapis.com/auth/photoslibrary.readonly.originals',
                'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
                'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata',
                'https://www.googleapis.com/auth/photoslibrary.appendonly'
                ]
            } as GoogleInitOptions)
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig
    },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    LocationService,
    AuthService,
    OpenStreetService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
