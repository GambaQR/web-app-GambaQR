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
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { KitchenDisplayComponent } from './seller/kitchen-display/kitchen-display.component';
import { RestaurantPanelComponent } from './restaurant-panel/restaurant-panel.component';
import { QrGeneratorComponent } from './restaurant/qr-generator/qr-generator.component';
import { AuthGuard } from './services/auth/auth.guard';
import { RoleGuard } from './services/auth/role.guard';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },

  // CLIENT
  { path: 'cart', component: CartComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT', 'EMPLOYEE', 'ADMIN', 'OWNER'] } },
  { path: 'checkout', component: CheckoutComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT', 'EMPLOYEE', 'ADMIN', 'OWNER'] } },
  { path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [RoleGuard], data: { roles: ['CLIENT', 'EMPLOYEE', 'ADMIN', 'OWNER'] } },

  // EMPLOYEE, ADMIN, OWNER
  { path: 'kitchen', component: KitchenDisplayComponent, canActivate: [RoleGuard], data: { roles: ['EMPLOYEE', 'ADMIN', 'OWNER'] } },

  // OWNER, ADMIN
  { path: 'restaurant', component: RestaurantPanelComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'OWNER'] } },
  { path: 'restaurant/qr-generator', component: QrGeneratorComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'OWNER'] } },

  // ZONA GENERAL
  {
    path: '', component: LayoutComponent, children: [
      { path: '', component: HomeComponent },
      { path: 'app', component: DashboardComponent },
      { path: 'user', component: ProfileComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'example', component: ExampleComponent },

    ]
  },
  { path: '**', component: NotFoundComponent },
]; 
