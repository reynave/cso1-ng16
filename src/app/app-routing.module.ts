import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StartupComponent } from './startup/startup.component';
import { SystemOfflineComponent } from './system-offline/system-offline.component';
import { LoginComponent } from './login/login.component';
import { MemberBarcodeComponent } from './login/member-barcode/member-barcode.component';
import { UserPhotoComponent } from './login/user-photo/user-photo.component';
import { AdminComponent } from './admin/admin.component';
import { CartComponent } from './cart/cart.component';
import { CartAdminComponent } from './cart/cart-admin/cart-admin.component';
import { CartFinishComponent } from './cart/cart-finish/cart-finish.component';
import { BillComponent } from './bill/bill.component';
import { ForbidenComponent } from './forbiden/forbiden.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PaymentBcaDebitComponent } from './payment/payment-bca-debit/payment-bca-debit.component';
import { PaymentBcaQrisComponent } from './payment/payment-bca-qris/payment-bca-qris.component';
import { PaymentBcaQris32Component } from './payment/payment-bca-qris32/payment-bca-qris32.component';
import { PaymentFakeComponent } from './payment/payment-fake/payment-fake.component';
import { PaymentQrisTelkomComponent } from './payment/payment-qris-telkom/payment-qris-telkom.component';
import { PaymentComponent } from './payment/payment.component';
import { PrintDetailComponent } from './print/print-detail/print-detail.component';
import { PrintSettingComponent } from './print/print-setting/print-setting.component';
import { PrintComponent } from './print/print.component';
import { SettingEcrComponent } from './setting-ecr/setting-ecr.component';

const routes: Routes = [
  { path: "", component: HomeComponent, data: { active: "home" }, },
  { path: "offline", component: SystemOfflineComponent, data: { active: "offline" }, },
  
  { path: "home", component: HomeComponent, data: { active: "home" }, },
  { path: "login", component: LoginComponent, data: { active: "login" }, },
  { path: "login/memberBarcode", component: MemberBarcodeComponent, data: { active: "login" }, },
  { path: "login/userPhoto", component: UserPhotoComponent, data: { active: "login" }, },
 
  { path: "startup", component: StartupComponent, data: { active: "startup" }, },
  { path: "admin", component: AdminComponent, data: { active: "startup" }, },


  { path: "cart", component: CartComponent, data: { active: "cart" }, },
  { path: "cart/admin", component: CartAdminComponent, data: { active: "cart" }, }, 
  { path: "cart/finish/:id", component: CartFinishComponent, data: { active: "cart" }, },
   
  { path: "bill", component: BillComponent, data: { active: "bill" }, },
  { path: "print", component: PrintComponent, data: { active: "print" }, },
  { path: "print/detail/:id", component: PrintDetailComponent, data: { active: "print" }, },
  { path: "print/setting", component: PrintSettingComponent, data: { active: "print" }, },
  
  { path: "payment", component: PaymentComponent, data: { active: "payment" }, },
  { path: "payment/qristelkom/:id", component: PaymentQrisTelkomComponent, data: { active: "payment" }, },
  { path: "payment/bcaDebit", component: PaymentBcaDebitComponent, data: { active: "payment" }, },
  { path: "payment/bcaQris", component: PaymentBcaQrisComponent, data: { active: "payment" }, },
  { path: "payment/bcaQris/32", component: PaymentBcaQris32Component, data: { active: "payment" }, },
  { path: "payment/fake/:id", component: PaymentFakeComponent, data: { active: "payment" }, },
  
  { path: "setting/ecr", component: SettingEcrComponent, data: { active: "setting" }, },
  
  { path: "forbiden", component: ForbidenComponent, data: { active: "home" }, },
  { path: "nofound", component: NotFoundComponent, data: { active: "home" }, },
  { path: "**", component: NotFoundComponent, data: { active: "404" } },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
