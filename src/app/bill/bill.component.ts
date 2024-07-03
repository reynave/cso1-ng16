import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  loading: boolean = false;
  api: string = environment.api;
  barcode: string = "";
  items: any = [];
  itemsList: any = [];
  freeItem : any = [];

  uuid : any;
  freeItemWaitingScan : any = [];
  freeItemLabel : number = 0;
  adminMode : boolean = false;
  summary: any = {
    Final: 0,
    NonBkp: 0,
    bkp: 0,
    discount: 0,
    dpp: 0,
    memberDiscount: 0,
    ppn: 0,
    total: 0,
    voucer: 0,
  }
  
  uuidKios : any  = localStorage.getItem(this.configService.myUUID()); 
  storeOutlesId: string = "";
  terminalId: string = "";
  
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.configService.httpAccount().subscribe(
      data=>{ 
        this.storeOutlesId = data['storeOutlesId'];
        this.terminalId  = data['terminalId'];
        if (data['systemOnline'] == false) {
          this.router.navigate(['offline']);
        }
      }
    )

    this.uuid = localStorage.getItem(this.configService.myUUID());
    if (localStorage.getItem(this.configService.myUUID())) {
      console.log("SILAKAN BELANJA!");
      this.httpGet();
    } else {
      this.router.navigate(['login']);
    }
  }

  httpGet() {
    this.loading = true;
    this.http.get<any>(this.api + 'kioskBill/index/?uuid=' + localStorage.getItem(this.configService.myUUID()),
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.items = data['items'];
        this.itemsList = data['itemsList'];
        this.freeItem =  data['freeItem'];
        this.freeItemLabel = data['freeItemLabel'];
        this.freeItemWaitingScan = data['freeItemWaitingScan'];
        this.summary = {
          final: data['summary']['final'],
          nonBkp: data['summary']['nonBkp'],
          bkp: data['summary']['bkp'],
          discount: data['summary']['discount'],
          dpp: data['summary']['dpp'],
          memberDiscount: data['summary']['memberDiscount'],
          ppn: data['summary']['ppn'], 
          total: data['summary']['total'],
          voucer: data['summary']['voucer'],
        }
      },
      e => {
        console.log(e);
      },
    );
  }

  modal(content: any) {
    this.modalService.open(content, { centered: true });
  }
  help(){ 
    const msg = {
      terminalId: this.terminalId,
    }
    this.configService.help(msg);
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
