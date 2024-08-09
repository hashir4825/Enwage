import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserFormComponent } from './user-form/user-form.component';
import { PagenationComponent } from './dashboard/pagenation/pagenation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ConfirmDeleteComponent } from './dashboard/confirm-delete/confirm-delete.component';
import { UserServiceService } from './Services/user-service.service';
import { HttpClientModule } from '@angular/common/http';
import { MaterialExampleModule } from 'src/material.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    UserFormComponent,
    PagenationComponent,
    // ConfirmDeleteComponent,
    
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialExampleModule,
    NoopAnimationsModule

  ],
  providers: [UserServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
