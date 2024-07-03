import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { PrintingService } from 'src/app/service/printing.service';

declare var window: any;
@Component({
  selector: 'app-print-detail',
  templateUrl: './print-detail.component.html',
  styleUrls: ['./print-detail.component.css']
})
export class PrintDetailComponent implements OnInit {
  loading: boolean = false;
  printerName: any;
  api: string = environment.api;
  barcode: string = "";
  items: any = [];
  itemsList: any = [];
  freeItem: any = [];
  uuid: any;
  freeItemWaitingScanFail: any = [];
  adminMode: boolean = false;
  id: string = "";
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
  printable: boolean = false;
  bill : any = [];
  date: string = "";
  template: any = {
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    footer: '',
  }
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private printing: PrintingService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.httpGet();
    console.log(this.activatedRoute.snapshot.params['id'])
  }




  print(name: string) {
    const body = {
      id: this.activatedRoute.snapshot.params['id'],
    }
    this.http.post<any>(this.api + 'kioskPrint/countingPrinting/', body,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        if (name == 'android') { 
          this.printing.print(body['id']); 
        }

        else if (name == 'browser') {
          window.print();
          console.log(data);
        }

      },
    );
  }

  httpGet() {
    this.loading = true;
    let url = this.api + 'KioskPrint/printDetail/?id=' + this.activatedRoute.snapshot.params['id'];
    console.log(url);
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.bill = data;
        this.printable = true;
        this.id = data['id'];
        this.date = data['date'];
        this.template = {
          companyName: data['template']['companyName'],
          companyAddress: data['template']['companyAddress'],
          companyPhone: data['template']['companyPhone'],
          footer: data['template']['footer'],
        }
        this.loading = false;

        this.items = data['items'];
        this.itemsList = data['itemsList'];
        this.freeItem = data['freeItem'];
        this.freeItemWaitingScanFail = data['freeItemWaitingScanFail'];
        this.summary = {
          total: data['summary']['total'],
          final: data['summary']['final'],
          nonBkp: data['summary']['nonBkp'],
          bkp: data['summary']['bkp'],
          discount: data['summary']['discount'],
          dpp: data['summary']['dpp'],
          discountMember: data['summary']['discountMember'],
          ppn: data['summary']['ppn'],
          voucher: data['summary']['voucher'],
        }
      },
      e => {
        console.log(e);
      },
    );
  }

  back() {
    window.history.back();
  }
}
