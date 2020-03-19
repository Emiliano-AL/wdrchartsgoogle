import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { WebDataRocksPivot } from "./webdatarocks/webdatarocks.angular4";
import { GoogleChartsModule } from "angular-google-charts";

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent, WebDataRocksPivot
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GoogleChartsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
