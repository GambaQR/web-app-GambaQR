import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ExampleComponent } from './example/example.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'app', component: DashboardComponent },
      { path: 'user', component: ProfileComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'example', component: ExampleComponent },
      { path: 'menu', component: MenuComponent }
    ]
  },
  { path: '**', component: NotFoundComponent },
]; 
