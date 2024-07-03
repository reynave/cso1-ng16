import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { QRCodeModule } from 'angularx-qrcode';


import { StartupComponent } from './startup/startup.component';
import { ForbidenComponent } from './forbiden/forbiden.component';
import { HeaderComponent } from './header/header.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminComponent } from './admin/admin.component';
import { BillComponent } from './bill/bill.component';
import { CartAdminComponent } from './cart/cart-admin/cart-admin.component';
import { CartFinishComponent } from './cart/cart-finish/cart-finish.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { MemberBarcodeComponent } from './login/member-barcode/member-barcode.component';
import { UserPhotoComponent } from './login/user-photo/user-photo.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PaymentBcaDebitComponent } from './payment/payment-bca-debit/payment-bca-debit.component';
import { PaymentBcaQrisComponent } from './payment/payment-bca-qris/payment-bca-qris.component';
import { PaymentBcaQris32Component } from './payment/payment-bca-qris32/payment-bca-qris32.component';
import { PaymentFakeComponent } from './payment/payment-fake/payment-fake.component';
import { PaymentQrisTelkomComponent } from './payment/payment-qris-telkom/payment-qris-telkom.component';
import { PaymentComponent } from './payment/payment.component';
//import { PhotoComponent } from './photo/photo.component';
import { PrintDetailComponent } from './print/print-detail/print-detail.component';
import { PrintSettingComponent } from './print/print-setting/print-setting.component';
import { PrintComponent } from './print/print.component';
import { SettingEcrComponent } from './setting-ecr/setting-ecr.component';
import { SystemOfflineComponent } from './system-offline/system-offline.component';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

const config: SocketIoConfig = { url: environment.socket_url, options: { transports: ['websocket'] } };

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ForbidenComponent,
    StartupComponent,
    LoginComponent,
    HomeComponent,
    CartComponent,
    PaymentComponent,
    CartFinishComponent,
   
    BillComponent,
    PrintComponent,
    PrintDetailComponent,
    AdminComponent,
    SystemOfflineComponent,
    MemberBarcodeComponent,
    PaymentQrisTelkomComponent,
    UserPhotoComponent,
    HeaderComponent,
    PrintSettingComponent,
    PaymentBcaDebitComponent,
    PaymentBcaQrisComponent,
    SettingEcrComponent,
    PaymentBcaQris32Component,
    PaymentFakeComponent,
    AdminHeaderComponent,
    CartAdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgxScannerQrcodeModule,
    QRCodeModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
