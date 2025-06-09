import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { MenuComponent } from './menu/menu.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { KitchenDisplayComponent } from './kitchen-display/kitchen-display.component';
import { RestaurantPanelComponent } from './restaurant-panel/restaurant-panel.component';
import { QrGeneratorComponent } from './restaurant/qr-generator/qr-generator.component';
import { AuthGuard } from './services/auth/auth.guard';
import { RoleGuard } from './services/auth/role.guard';
import { TestOrderCreatorComponent } from './test-order-creator/test-order-creator.component';


export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      // ZONA GENERAL
      { path: '', component: HomeComponent },
      { path: 'user', component: ProfileComponent },
      { path: 'test-order-kitchen', component: TestOrderCreatorComponent },


      // ZONA ADMIN
      { path: 'app', component: DashboardComponent },

      // ZONA CLIENTE
      { path: 'menu', component: MenuComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order-confirmation', component: OrderConfirmationComponent },

      // EMPLOYEE, ADMIN, OWNER
      { path: 'kitchen-display', component: KitchenDisplayComponent, canActivate: [RoleGuard], data: { roles: ['EMPLOYEE', 'ADMIN', 'OWNER'] } },

      // OWNER, ADMIN
      { path: 'restaurant', component: RestaurantPanelComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'OWNER'] } },
      { path: 'restaurant/qr-generator', component: QrGeneratorComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'OWNER'] } },
    ]
  },
  { path: '**', component: NotFoundComponent },
]; 
