import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild('formRow') rows: ElementRef | any;
  resultbox: boolean = false;
  loading: boolean = false;
  api: string = environment.api;
  barcode: string = "";
  items: any = [];
  adminMode: boolean = false;
  userId: string = "";
  addItem: boolean = false;
  // Demo 0000022
  error: boolean = false;
  noteScanner: string = "";
  item: any = {
    name: "",
    barcode: "",
    price: 0,
  }
  freeItem: any = [];
  itemsList: any = [];
  itemsListfreeItem: any = [];
  member: any = [];
  summary: any = {
    BKP: 0,
    DPP: 0,
    nonBKP: 0,
    discount: 0,
    subtotal: 0,
    totalAterTax: 0
  }
  supervisor: any = {
    name: "",
    id: 0,
  }
  private _docSub: any;

  uuidKios: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";
  ilock: boolean = false;
  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }


  ngOnInit(): void {
   
    this._docSub = this.configService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
       
        if (data['action'] == 'reload' && data['to'] == 'terminal') {
          this.httpGet();
          console.log("SOCKET getMessage");
        }
      }
    );

    if (localStorage.getItem(this.configService.myUUID())) {
      this.httpGet();
      this.callHttpServer();
      this.configService.httpAccount().subscribe(
        data=>{ 
          this.storeOutlesId = data['storeOutlesId'];
          this.terminalId  = data['terminalId'];
          if (data['systemOnline'] == false) {
            this.router.navigate(['offline']);
            console.log("here offline");
          }
        }
      )
    } else {
      console.log("here login");
      this.router.navigate(['login']);
    }
  }


  callServer: any;
  callHttpServer() {
    this.callServer = setInterval(() => {
      this.rows.nativeElement.focus();
    }, 300);
  }
  ngOnDestroy() {
    clearInterval(this.callServer);
    this._docSub.unsubscribe();
  }
  help(){ 
    const msg = {
      terminalId: this.terminalId,
    }
    this.configService.help(msg); 
  }
  sendReload(){
    const msg = {
      to: 'supervisor',
      msg: 'Scan items Success',
      action : 'reload',
    }
    this.configService.sendMessage(msg);
    console.log("sendReload");
  }

  httpGet() {
    this.loading = true;
    this.http.get<any>(this.api + 'kioskCart/index/?uuid=' + localStorage.getItem(this.configService.myUUID()),
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        if (data['ilock'] == true) {
          this.router.navigate(['bill']);
        } else {
          this.loading = false;
          this.items = data['items'];
          this.freeItem = data['freeItem'];
          this.ilock = data['ilock'];
          this.itemsList = data['itemsList'];
          this.itemsListfreeItem = data['itemsListfreeItem'];

          this.member = data['member'];
          this.summary = {
            final: data['summary']['final'],
            discount: data['summary']['discount'],
            total: data['summary']['total'] == null ? 0 : data['summary']['total'],
          }
        }
      },
      e => {
        console.log(e);
      },
    );
  }
 

  scanner() {
    this.loading = true;
    this.noteScanner = "";
    this.resultbox = true;
    const body = {
      barcode: this.barcode,
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
      memberId: 0,
    }

    if (this.barcode != "") {
      this.addItem = true; 
      this.http.post<any>(this.api + 'kioskCart/scanner/', body,
        { headers: this.configService.headers() }
      ).subscribe(
        data => {
          this.modalService.dismissAll();
          console.log(data);
          this.loading = false;
          if (data['error'] == false) {
            this.httpGet();
            this.error = false;
            if (data['admin'] == false) {
              this.item = {
                name: data['items']['description'],
                barcode: data['items']['barcode'],
                price: data['items']['price'],
                images: data['items']['images'],
              } 
              this.sendReload();
            } else { 
              this.adminMode = true; 
              this.router.navigate(['cart/admin']);
            }

          } else { 
            this.error = true; 
            this.loading = false; 
          }

          if (data['relogin'] == true) {
             this.error = true;
             localStorage.removeItem(this.configService.myUUID()); 
             this.loading = false;
             this.router.navigate(['login'])
          }

          this.barcode = "";
          this.noteScanner = data['note'];
        },
      );
    }
  }

  fnUpdate(x: any) {
    const body = {
      items: x,
      userId: this.supervisor['id'],
    }
 
    this.http.post<any>(this.api + 'kioskCart/fnUpdate/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.httpGet();
        this.sendReload();
      },
    );
  }

  fnPromo(){
    const body = {
      uuid: localStorage.getItem(this.configService.myUUID()),
    }
    this.http.post<any>(this.api + 'kioskCart/fnCloseCart/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.httpGet();
      },
    );
  }


  fnCloseCart() {
    const body = {
      uuid: localStorage.getItem(this.configService.myUUID()),
    }
    this.http.post<any>(this.api + 'kioskCart/fnCloseCart/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.router.navigate(['bill']);
      },
    );
  }

  modal(content: any) {
    this.modalService.open(content, { centered: true });
  }

  fnLogoutVisitor() {
    const body = {
      kioskUuid: localStorage.getItem(this.configService.myUUID()),
    }
    this.http.post<any>(this.api + 'kioskCart/fnLogoutVisitor/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.sendReload();
        this.modalService.dismissAll();
        localStorage.removeItem(this.configService.myUUID());
        this.router.navigate(['login']);
      },
    );

  }


}

