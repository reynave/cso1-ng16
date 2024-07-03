import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { PrintingService } from '../service/printing.service';

declare var window: any;
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class PaymentComponent implements OnInit {
  loading: boolean = false;
  api: string = environment.api;
  items: any = [];
  error: boolean = false;
  final: number = 0;
  paymentStatus: number = 1;
  paymentTypeId: number = 0;
  storeOutlesPaymentType: any = [];
  t1_thank_you_display: any;
  constructor(
    private http: HttpClient,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private printing: PrintingService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
 
  uuidKios: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";
  private _docSub: any;


  ngOnInit(): void { 
    this._docSub = this.configService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {  
      }
    );
 
    this.configService.httpAccount().subscribe(
      data => {
        this.storeOutlesId = data['storeOutlesId'];
        this.terminalId = data['terminalId'];
        this.t1_thank_you_display = data['account'][data['account'].findIndex(((obj: { id: number; }) => obj.id == 1004))]['value'];
        if (data['systemOnline'] == false) {
          this.router.navigate(['offline']);
        }
      }
    )
    if (localStorage.getItem(this.configService.myUUID())) {
 
      this.httpGet();
      this.httpCart();
    } else {
      this.router.navigate(['login']);
    }

  }
  ngOnDestroy() { 
    this._docSub.unsubscribe();
  }

  modal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  help() {
    const msg = {
      terminalId: this.terminalId,
    }
    this.configService.help(msg);
  }
  httpGet() {
    this.loading = true;
    let url = this.api + 'kioskPayment/index/?uuid=' + localStorage.getItem(this.configService.myUUID());
 
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        if(data['kioskUuid']['ilock'] == 1  ){
          if( data['kioskUuid']['reffNo'] != null ){
            this.router.navigate(['payment/bcaQris/32'], {queryParams:{RRN:data['kioskUuid']['reffNo']}});
          }
         
        }
        this.loading = false; 
        this.final = data['summary']['final'];
        this.storeOutlesPaymentType = data['storeOutlesPaymentType'];
      },
      e => {
        console.log(e);
      },
    );
  }

  httpCart() {
    this.loading = true;
    let url = this.api + 'kioskCart/index/?uuid=' + localStorage.getItem(this.configService.myUUID()) + "&storeOutlesId=" + localStorage.getItem('storeOutlesId') + "&terminalId=" + localStorage.getItem('terminalId');

    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.loading = false; 

      },
      e => {
        console.log(e);
      },
    );
  }

  payment(x: any) {
    const body = {
      kioskUuid : localStorage.getItem(this.configService.myUUID()),
      lock  : 1,
    }
    this.http.post<any>(environment.api+"kioskCart/lock",body,{
      headers:this.configService.headers(),
    }).subscribe(
      data=>{
        if (x.paymentTypeId == 'QRT001') {
          this.router.navigate(['payment/qristelkom/', x.paymentTypeId]);
        } 
        else if (x.paymentTypeId == 'BCA01') {
          this.router.navigate(['payment/bcaDebit/']);
        }
        else if (x.paymentTypeId == 'BCA31') {
          this.router.navigate(['payment/bcaQris/']);
        }
        else if (x.paymentTypeId == 'FP01') {
          this.router.navigate(['payment/fake/', x.paymentTypeId]);
        } 
      },
      error=>{
        console.log(error);
        alert("ERROR SETTING, PLEASE CONTACT YOUR SA");
      }
    )

    
  } 

  fnLogoutVisitor() {
    const body = {
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
    }
    console.log(body);
    this.http.post<any>(this.api + 'kioskCart/fnLogoutVisitor/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.modalService.dismissAll();
        localStorage.removeItem(this.configService.myUUID());
        this.router.navigate(['login']);
      },
    );

  }
}
