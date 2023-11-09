import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { FilterService } from './shared/Filter/filter.service';

import { UserService } from './shared/user/user.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import {
  NativeGeocoder,
  NativeGeocoderResult,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

import { ToggleOptionComponent } from './filter/toggle-option/toggle-option.component';
import { FilterOptionComponent } from './filter/filter-option/filter-option.component';
import { FilterOptionSubListComponent } from './filter/filter-option-sub-list/filter-option-sub-list.component';

import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/module/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    ToggleOptionComponent,
    FilterOptionComponent,
    FilterOptionSubListComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
  ],
  providers: [
    StatusBar,
    //SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    FilterService,
    UserService,
    ScreenOrientation,
    NativeGeocoder,
    LaunchNavigator,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
