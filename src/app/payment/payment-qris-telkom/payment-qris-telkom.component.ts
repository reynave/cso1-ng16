import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { PrintingService } from 'src/app/service/printing.service';

declare var window: any;
@Component({
  selector: 'app-payment-qris-telkom',
  templateUrl: './payment-qris-telkom.component.html',
  styleUrls: ['./payment-qris-telkom.component.css']
})
export class PaymentQrisTelkomComponent implements OnInit , OnDestroy {
  loading: boolean = false;
  api: string = environment.api;
  items: any = [];
  error: boolean = false;
  summary: any = [];

  uuidKios: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";
  image: string = "";
  status: boolean = true;
  qrcode: string = "";
  loadingStatus: boolean = false;
  name: string = "";
  nmid: string = "";
  exp: string = "";
  constructor(
    private http: HttpClient,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private printing: PrintingService,
  ) { }

  ngOnInit(): void {
    this.httpGet();
    this.configService.httpAccount().subscribe(
      data => {
        this.storeOutlesId = data['storeOutlesId'];
        this.terminalId = data['terminalId'];
      }
    );
  }
  timeInterval : any ;
  ngOnDestroy() { 
      clearInterval(this.timeInterval); 
  }
  httpGet() {
    this.loading = true;
    let url = environment.api + "kioskPayment/fnQrisTelkom/?kioskUuid=" + this.uuidKios;
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.status = data['status'];
        this.image = data['image'];
        this.loading = false;
        console.log('httpGet',data);
        this.summary = data['summary'];
        this.qrcode = data['qris'];
        this.name = data['name'];
        this.nmid = data['nmid'];
        this.exp = data['exp'];

        this.timeInterval = setInterval(() => {
           this.fnQrisTelkomStatus();
          console.log('Check Status ',this.timeInterval)
        }, 30000);


      },
      e => {
        console.log(e);
      },
    );
  }

  fnGenerate() {
    let url = environment.api + "kioskPayment/fnQrisTelkomRegenerate/";
    const body = {
      kioskUuid: this.uuidKios,
    }
    this.http.post<any>(url, body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        history.back();
      },
      e => {
        console.log(e);
      },
    );
  }


  note: string = "";
  fnQrisTelkomStatus() {
    this.note = "";
    this.loadingStatus = true;
    let url = environment.api + "kioskPayment/fnQrisTelkomStatus/?kioskUuid=" + this.uuidKios;
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        if (data['qris']['data']['qris_status'] == 'paid') {
          console.log('paid');
          this.note = data['qris']['data']['qris_status'];
          var self = this;
          setTimeout(function(){
            self.fnProcessPaymentReal(data['qris']);
          },1000);
        } else if (data['qris']['data']['qris_status'] == 'unpaid') {
          this.loadingStatus = false;
          console.log('unpaid');
          this.note = data['qris']['data']['qris_status'];
        } else {
          this.loadingStatus = false;
          console.log('not register');
          this.note = 'not register';
        }
        console.log(data);
      },
      e => {
        console.log(e);
      },
    );

  }

  help() {
    const msg = {
      terminalId: this.terminalId,
    }
    this.configService.help(msg);
  }

  fnProcessPaymentReal(data: any) {
    const body = {
      paymentTypeId: 'QRT001',
      qris: data,
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
      storeOutlesId: localStorage.getItem('storeOutlesId'),
      terminalId: localStorage.getItem('terminalId'),

    }
    this.loading = true;
    console.log(body);
    this.http.post<any>(this.api + 'kioskPayment/fnProcessPaymentReal/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        localStorage.removeItem(this.configService.myUUID());
        this.loading = false;
        /**
         * status payment disini
         */
        // this.paymentStatus = 2; 
        this.router.navigate(['cart/finish/', data['id']]).then(
          () => {
            this.printing.print(data['id']); 
          }
        )
      },
      e => {
        console.log(e);
      },
    );

  }


/*
  printerName: any;
  bill: any;
  print(id: string) {

    let url = this.api + 'KioskPrint/printDetail/?id=' + id;
    console.log(url);
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.bill = data;
        let message = this.printing.template(this.bill);
        this.printerName = localStorage.getItem(this.configService.printerName());
        if (this.printerName == "" || this.printerName == null) {
          alert("NO PRINTING SELECT");
        } else {

          window['cordova'].plugins.UsbPrinter.connect(this.printerName, (result: any) => {
            console.log(result);
            window['cordova'].plugins.UsbPrinter.print(this.printerName, message, (result: any) => {
              console.log("result of usb print action", result);
            }, (err: any) => {
              console.error('Error in usb print action', err)
            });

          }, (err: any) => {
            console.error(err);
          });
        }
      },
      e => {
        console.log(e);
      },
    );


  }
*/

}
