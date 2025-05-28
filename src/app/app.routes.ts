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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation', component: OrderConfirmationComponent },
  { path: 'kitchen', component: KitchenDisplayComponent },
  { path: 'restaurant', component: RestaurantPanelComponent },
  { path: 'restaurant/qr-generator', component: QrGeneratorComponent },
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
