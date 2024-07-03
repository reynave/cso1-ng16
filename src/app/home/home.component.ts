import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  screenWidth: number = window.innerWidth;
  screenHeight: number = window.innerHeight;

  closeResult: string = '';
  api : string = environment.api;
  env_api : string = environment.api;
  env_socket : string = environment.socket_url;
  note:any;
  today: any = new Date();
  version: string = environment.version;
  loading : boolean = false;
  device : boolean =  environment.device;
  serialNumber : any;
  logSave:string = "";
  constructor(
    private modalService: NgbModal,
    private configService: ConfigService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getScreenSize();
    this.serialNumber =  localStorage.getItem(this.configService.deviceUuid());
  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: Event): void {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }
 
  fnSaveManualSerialNumber(){
    localStorage.setItem(this.configService.deviceUuid(), this.serialNumber);
    this.logSave = " Save";
  }
  fnIframe(){
    console.log("Sending message to parent");
    const message = { data: 'Hello from iframe!', action : 'con3' };
    window.parent.postMessage(message, '*');
  }
  fnTestCon() {
    this.loading = true;
    let url = this.api ;
    this.note = {
      status : 'waiting connection 2',
    }

    console.log(url);
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.note = data; 
      },
      e => {
        console.log(e);
        this.note = {
          status : 'ERROR',
        }
      },
    );
  }

  fnTestConInternet() {
    this.loading = true;
    this.note = {
      status : 'waiting connection 2',
    }

    let url = 'https://app.openakunting.com/api/demo/' ;
    console.log(url);
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        this.loading = false;
        console.log(data);
        this.note = data; 
      },
      e => {
        console.log(e);
        this.note = {
          status : 'ERROR',
        }
      },
    );
  }

  open(content: any) {
    this.modalService.open(content, { fullscreen: true }).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log('close');
    });
  }

}
