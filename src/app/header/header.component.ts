import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrintingService } from '../service/printing.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  outletId: any;
  loading: boolean = false;
  api: string = environment.api;
  myUUID: any;
  isStillLogin: boolean = false;
  memberId: string = "";
  member: any = [];
  loginSuccess: boolean = false;
  kioskUuid: any = localStorage.getItem(this.configService.myUUID());
  private _docSub: any;
  storeOutlesId: string = "";
  terminalId: string = "";
  constructor(
    private configService: ConfigService,
    private router: Router,
    private printing: PrintingService,
    config: NgbModalConfig,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  printerName: any;

  ngOnInit(): void {
    console.log(localStorage.getItem(this.configService.myUUID()));
    this._docSub = this.configService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
        console.log("socket Header,",data);
        // if (data['action'] == 'turnOn') {
        //   if (data['msg'] == '0') { 
        //     localStorage.removeItem('t1_kioskUuid'); 
        //     setTimeout(() => {
        //       this.router.navigate(['login']);
        //     }, 2000); 
        //   }
        // }
        if (data['action'] == 'deleteCart'  && data['kioskUuid'] == localStorage.getItem(this.configService.myUUID())    ) { 
          localStorage.removeItem('t1_kioskUuid');  
          setTimeout(() => {
            this.router.navigate(['login']);
          }, 2000); 
        }

        if (data['action'] == 'paid' && data['kioskUuid'] == localStorage.getItem(this.configService.myUUID())) {
          localStorage.removeItem(this.configService.myUUID());
          this.loading = false; 
          setTimeout(() => {
            this.router.navigate(['cart/finish/', data['id']]).then(
              () => {
                this.printing.print(data['id']);
              }
            )
          }, 500); 
          
        }
      }
    );
 

    if (localStorage.getItem(this.configService.myUUID()) !== null) {
      this.isStillLogin = true;
      this.myUUID = localStorage.getItem(this.configService.myUUID());
    }
    this.httpGet();
    this.configService.httpAccount().subscribe(
      data => {

        if (data['systemOnline'] == false || data['turnOn'] == 0) {
          this.router.navigate(['offline']);
        }
        this.storeOutlesId = data['storeOutlesId'];
        this.terminalId = data['terminalId'];

      },
      e => {
        console.log(e);
      },
    );
  }

  httpGet() {
    this.printerName = localStorage.getItem(this.configService.printerName());
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }




}
