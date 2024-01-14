import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { DefaultPageComponent } from './default-page/default-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { TokenService } from './shared/services/token.service';
import { environment } from 'src/environments/environment';

function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

function jwtOptionsFactory(tokenService: any): any {
  return {
    tokenGetter: () => {
      return tokenService.getToken();
    },
    allowedDomains: [environment.host]
  };
}

@NgModule({
  declarations: [
    AppComponent,
    DefaultPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [TokenService]
      }
    }),
    NgxWebstorageModule.forRoot({
      prefix: `omdm_v${environment.version}`,
      separator: '_',
      caseSensitive: true
    }),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
    }),
    AngularSvgIconModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
