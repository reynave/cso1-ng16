import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { PrintingService } from 'src/app/service/printing.service';
@Component({
  selector: 'app-payment-bca-qris32',
  templateUrl: './payment-bca-qris32.component.html',
  styleUrls: ['./payment-bca-qris32.component.css']
})
export class PaymentBcaQris32Component implements OnInit, OnDestroy {
  loading: boolean = false;
  api: string = environment.api;
  items: any = [];
  error: boolean = false; 
  env_ecr : any = "";
  running: boolean = true; 
  note : string = "";
  myTimeout: any;
  terminalId: string = ""; 
  RRN : string = "";
  kioskUuid : any;
  grandTotal :  number = 0;
  constructor(
    private http: HttpClient,
    config: NgbModalConfig, 
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private printing: PrintingService,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
 
  ngOnInit(): void { 
    this.setInit();
    this.httpGet();
    this.loading = true;
    
  }
  
  setInit() {
    this.kioskUuid =  localStorage.getItem(this.configService.myUUID());
    this.RRN = this.activatedRoute.snapshot.queryParams['RRN'];
    this.env_ecr = localStorage.getItem("env_ecr");
  }

  httpGet() {  
    this.loading = true;
    this.http.get<any>(this.api + 'kioskBill/grandTotal/?uuid=' + localStorage.getItem(this.configService.myUUID()),
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data); 
        this.grandTotal = data['summary']['total'];
      },
      e => {
        console.log(e);
      },
    );
  }

  fnRequestQrisPaid(){ 
    let RRN = this.activatedRoute.snapshot.queryParams['RRN'];
    this.note = "<h1>Checking...</h1>";
    console.log("CALL 32");
    const body = {
      amount: 0,
      RNN : RRN,
      transType: "32",
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

        let TransAmount = parseInt(data['resp']['TransAmount']) / 100;
        if (data['resp']['RespCode'] == '00' && data['resp']['ApprovalCode'] != '') {
          this.fnPaid(data)
        }
          
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
 

  back() {
    history.back();
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");  
  }

  backToBill(){
    this.router.navigate(['bill']);
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
        localStorage.removeItem(this.configService.myUUID());
        this.router.navigate(['login']);
      },
    );

  }
} 