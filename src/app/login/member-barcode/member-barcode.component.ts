import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-member-barcode',
  templateUrl: './member-barcode.component.html',
  styleUrls: ['./member-barcode.component.css']
})
export class MemberBarcodeComponent implements OnInit, OnDestroy {
  @ViewChild('formRow') rows: ElementRef | any;
  outletId: any;
  loading: boolean = false;
  api: string = environment.api;
  version: string = environment.version;
  myUUID: any;
  isStillLogin: boolean = false;
  interval: any;
  memberId: any = "";
  loop: number = 0;
  notes: string = "";
  greeting: string = "";
  kioskMessage: any = {
    logo: "",
    welcome: "",
    limit: "",
    visitorDisplay: "",
    timer: 5,
    notFound: '',
    memberPhoto: false,
  };
  member: any = [];
  myTimeout: any;
  loginSuccess: boolean = false;
  kioskUuid: string = '';
  intervalTime: any;
  countdown: number = 0;
  today: any = new Date();
  autoFocus: any;
  uuidKios: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  callServer: any;

  ngOnInit(): void {
    this.callHttpServer();
    if (localStorage.getItem(this.configService.myUUID()) !== null) {
      this.isStillLogin = true;
      this.myUUID = localStorage.getItem(this.configService.myUUID());
      this.router.navigate(['cart'], { queryParams: { kioskUuid: this.kioskUuid }, });
    }

    this.configService.httpAccount().subscribe(
      data => {
        console.log(data);
        if (data['systemOnline'] == false) {
          this.router.navigate(['offline']);
        }
        this.storeOutlesId = data['storeOutlesId'];
        this.terminalId = data['terminalId'];
        this.greeting = data['greeting'];
        this.kioskMessage = {
          customerStatement: data['account'][data['account'].findIndex(((obj: { id: number; }) => obj.id == 1003))]['value'],
          memberNotFound: data['account'][data['account'].findIndex(((obj: { id: number; }) => obj.id == 1005))]['value'],
          timer: data['account'][data['account'].findIndex(((obj: { id: number; }) => obj.id == 1008))]['value'],
          memberPhoto: data['account'][data['account'].findIndex(((obj: { id: number; }) => obj.id == 15))]['value'] == "1" ? true : false,

        }
      
        //this.countdown = this.kioskMessage['timer'];
        this.countdown = 60;

      }
    );
  }
  callHttpServer() {
    this.callServer = setInterval(() => {
      this.rows.nativeElement.focus();
    }, 300);
  }
  ngOnDestroy() {
    clearInterval(this.callServer);
    console.log("NGONDESTROY");
  }
  goToCart() {
    if (this.kioskMessage.memberPhoto == 1) { 
      this.router.navigate(['login/userPhoto']);
    } else {
      this.router.navigate(['cart'], { queryParams: { kioskUuid: this.kioskUuid }, });
    } 
  }
  runCountdown() {
    let self = this;
    this.intervalTime = setInterval(function () {
      self.countdown--;
    }, 1000);
  }
  scannerMember() {
    this.fnSubmitMemberIdManual();
  }

  sendReload() {
    const msg = {
      to: 'supervisor',
      msg: 'request reload',
      action: 'reload',
    }
    console.log(msg);
    this.configService.sendMessage(msg);
  }
  addText(str: string) {
    console.log(str);
    this.memberId += str;
  }
  fnSubmitMemberIdManual() {
    const body = {
      memberId: this.memberId,
    }
    this.http.post<any>(this.api + 'kioskLogin/loginMember/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.loading = false;
        this.memberId = "";
        console.log(data);
        if (data['error'] == false) {
          this.sendReload();
          this.member = data['member'];
          this.loginSuccess = true;
          localStorage.setItem("t1_kioskUuid", data['insert']['kioskUuid']);
          this.kioskUuid = data['insert']['kioskUuid'];
          this.notes = data['welcomeMember'];
          this.member = data['member'];
          let self = this;
          this.runCountdown();
          this.myTimeout = setTimeout(function () {
            self.goToCart();
            self.modalService.dismissAll();
            console.log('this.myTimeout TRIGER');
          }, parseInt(this.kioskMessage['timer']) * 1000);
          console.log("wait for " + parseInt(this.kioskMessage['timer']));

        } else {
          this.notes = this.kioskMessage['memberNotFound'];
          console.log("MEMBER ID NOT FOUND");
        }
      },
      e => {
        this.notes = this.kioskMessage['memberNotFound'];
        console.log("MEMBER ID NOT FOUND");
        console.log(e);
      },
    );
  }
  clear() {
    this.memberId = '';
  }
  back() {
    history.back();
  }
}
