import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { PrintingService } from 'src/app/service/printing.service';
@Component({
  selector: 'app-payment-bca-qris',
  templateUrl: './payment-bca-qris.component.html',
  styleUrls: ['./payment-bca-qris.component.css']
})
export class PaymentBcaQrisComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  api: string = environment.api;
  items: any = [];
  error: boolean = false;
  final: number = 0;
  paymentStatus: number = 1;
  paymentTypeId: number = 0;
  storeOutlesPaymentType: any = [];
  t1_thank_you_display: any;
  reffNo: string = "";
  note: string = "Generate QRIS, please wait...";
  uuidKios: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";
  ilock: boolean = false;
  generateQris: boolean = true; 
  developerMode: boolean = environment.developerMode;
  myInterval: any;
  transType: string = '0';
  hex: string = "";
  myTimeout: any;
  running: boolean = true;
  bill : any = "";
  message : string = "";
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
  n: number = 40;
  env_ecr: any = "";
  finish: boolean = false;

  ngOnInit(): void {
    this.message = "Wait...";
    this.loading = true;
    this.setInit();
    this.httpGet();
    this.bill = localStorage.getItem(this.configService.myUUID());
    
  }
  setInit() {
    this.env_ecr = localStorage.getItem("env_ecr");
  }
  httpGet() {
    this.message = `<h1>Silakan tekan tombol <b>OK</b> atau <b><span class="bg-success px-2 text-white">Hijau</span>
                    <br></b> pada mesin Edisi BCA<br><br>Tunggu sampai Edisi mencetak QRCODE</h1>`;
    this.n = 60;
    this.loading = true;
    this.http.get<any>(this.api + 'kioskBill/grandTotal/?uuid=' + localStorage.getItem(this.configService.myUUID()),
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.fnPayment(data['grandTotal']);
        this.myTimeout = setInterval(() => {
          this.n--;
          if (this.n <= 0) {
            clearTimeout(this.myTimeout);
          }
        }, 1000);

      },
      e => {
        console.log(e);
      },
    );
  } 
  fnPayment(grandTotal: number) {
    this.loading = true;
    this.note = "Waiting payment..";
    const body = {
      amount: grandTotal,
      transType: "31",
      ip: this.env_ecr
    }
    this.http.post<any>(environment.apiBCA + "payment", body).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.note = data['resp']['response'];
        if (data['resp']['RespCode'] != '00') {
          this.running = false;
        } 
        //let TransAmount = parseInt(data['resp']['TransAmount']) / 100;

        // if (data['resp']['RespCode'] == '00' && data['resp']['ApprovalCode'] != '' && TransAmount == grandTotal) {
        //   this.fnPaid(data)
        // }

        if (data['resp']['RespCode'] == '00' && data['resp']['ApprovalCode'] == '' && data['resp']['RRN'] != '') {
         setTimeout(() => {
           // this.fnRequestQrisPaid(data['resp']['RRN'], grandTotal); 

              const data2 = {
                kioskUuid :localStorage.getItem(this.configService.myUUID()), 
                reffNo  : data['resp']['RRN'],
                navigate : 'payment/bcaQris/32?RRN='+data['resp']['RRN'],
              }
              this.http.post<any>(this.api + 'kioskCart/lockBcaQris/', data2,
                { headers: this.configService.headers() }
              ).subscribe(
                data=>{
                  console.log(data);
                  this.router.navigate(['payment/bcaQris/32'], { queryParams : {RRN : data2['reffNo']}} );
                },
                error => {
                  console.log(error);
                  alert("ERROR 31");
                }
              ) 
           
         }, 1000);
        }

        clearTimeout(this.myTimeout);

      },
      error => {
        this.loading = false;
        console.log(error);
      }
    )
  }
 

  fnPaid(data: any) {
    const body = {
      paymentTypeId: 'BCA31',
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
      data: data,
    }
    this.loading = true;
    this.http.post<any>(this.api + 'kioskPayment/fnPaid/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        localStorage.removeItem(this.configService.myUUID());
        this.loading = false;
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

  help() {
    const msg = {
      terminalId: this.terminalId,
    }
    this.configService.help(msg);
  }

  cancel() {
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
  reload() {
    this.running = true;
    this.httpGet();
  }
  back() {
    history.back();
  }

  ngOnDestroy(): void {
    console.log("paymentBCAQRIS.ts gOnDestroy");
    clearInterval(this.myInterval); 
    this.modalService.dismissAll();
    clearTimeout(this.myTimeout);
  }
}
