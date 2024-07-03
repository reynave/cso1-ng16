import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { PrintingService } from 'src/app/service/printing.service';
@Component({
  selector: 'app-payment-bca-debit',
  templateUrl: './payment-bca-debit.component.html',
  styleUrls: ['./payment-bca-debit.component.css']
})
export class PaymentBcaDebitComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  api: string = environment.api;
  items: any = [];
  error: boolean = false;
  final: number = 0;
  paymentStatus: number = 1;
  paymentTypeId: number = 0;
  storeOutlesPaymentType: any = [];
  t1_thank_you_display: any;
  developerMode: boolean = environment.developerMode;
  note: string = "Connection ECR BCA";
  uuidKios: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";
  ilock: boolean = false;
  myTimeout: any;
  running : boolean = true;
  private _docSub: any;
  message: string = "";
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
  env_ecr: any = "";
  finish: boolean = false;
  ping: boolean = false;
  n: number = 40;
  bill : any = "";
  ngOnInit(): void {
    this.setInit();
    this.httpGet();
    this.bill = localStorage.getItem(this.configService.myUUID());
    this._docSub = this.configService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
        console.log(data);
      }
    );
  }
  setInit() {
    this.env_ecr = localStorage.getItem("env_ecr");
  }
  httpGet() {
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
          if(this.n <= 0 ){
            clearTimeout(this.myTimeout);
          }
        }, 1000);

      },
      e => {
        console.log(e);
      },
    );
  }
  cancel(){
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
  reload(){
    this.running = true;
    this.httpGet();
  }
  fnPayment(grandTotal: number) {
    this.loading = true;
    this.note = "Waiting payment..";
    const body = {
      amount: grandTotal,
      transType: "01",
      ip: this.env_ecr
    }
    this.http.post<any>(environment.apiBCA + "payment", body).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.note = data['resp']['response'];
        if(data['resp']['RespCode'] != '00'){
          this.running = false;
        }


        let TransAmount = parseInt(data['resp']['TransAmount'])/100;

        if(data['resp']['RespCode'] == '00' && data['resp']['ApprovalCode'] != '' &&  TransAmount ==  grandTotal){
          this.fnPaid(data)
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
      paymentTypeId: 'BCA01',
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

  fnProcessPaymentReal_DEL(data: any) {
    const body = {
      paymentTypeId: 'BCA01',
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
      data: data,
    }
    this.loading = true;
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

  help() {
    const msg = {
      terminalId: this.terminalId,
    }
    this.configService.help(msg);
  }

  fnBcaECR_DEL(transType: string = "", dummyCC: boolean = false) {

    const body = {
      paymentTypeId: 'bca01',
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
      transType: transType,
      dummyCC: dummyCC,
    }
    this.loading = true;

    this.http.post<any>(this.api + 'kioskPaymentBca/fnBcaEcr/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.loading = false;
      },
      e => {
        console.log(e);
      },
    );
  }


  back() {
    history.back();
  }

  ngOnDestroy(): void {
    console.log("payment-bca-debit.component.ts ngOnDestroy");
    this._docSub.unsubscribe();
    this.modalService.dismissAll();
    clearTimeout(this.myTimeout);
  }
}
