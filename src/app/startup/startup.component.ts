import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ConfigService } from 'src/app/service/config.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var device: any;
@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css']
})
export class StartupComponent implements OnInit {
  loading: boolean = false;
  api: string = environment.api;
  serialNumber: any  ;
  terminal: any = {
    id: "",
    name: "",
    storeOutlesId: "",
    keyLisence: "",
    token: "",
    status: 0,
    presence: 0,
    inputBy: 0,
    inputDate: 0,
    updateDate: 0,
    updateBy: 0
  }
  agent: any = [];
  deviceUuid: string = "";
  error: boolean = true;
  note: string = "";
  systemOnline: boolean = false;
  platform: string = "browser"; 
  printer : any;
  deviceLogs : any;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
   
    let onDeviceReady = () => {
      console.log('cordova ', device.cordova);
      console.log('model ', device.model);
      console.log('platform ', device.platform);
      console.log('uuid ', device.uuid);
      console.log('manufacturer ', device.manufacturer);
      console.log('isVirtual ', device.isVirtual);
      console.log('serial ', device.serial);
      this.deviceLogs = device;
    };
    document.addEventListener('deviceready', onDeviceReady, false);
    this.reload();
 
  }
  
  reload() {
    this.fnSaveDeviceID();
    this.httpGet();
    this.printer = this.configService.printer();
  }


  fnSaveDeviceID() {
    this.agent = this.configService.agent();
    console.log(this.agent);
    console.log("Device : ", environment.device);
    // if (environment.device == false) { 
    //   localStorage.setItem(this.configService.deviceUuid(), environment.token);  
    //   this.serialNumber = environment.token;
    // } else { 
       
       this.serialNumber =  localStorage.getItem(this.configService.deviceUuid());
      
    // } 
  }

  back(){
    history.back();
  }
  httpGet() {

    console.log("keygen  ",this.configService.keygen() ); 
    this.loading = true;
    let api = this.api + 'kioskStartup/account/?token=' + this.configService.keygen();
    console.log(api);
    this.http.get<any>(api
    ).subscribe(
      data => {
        this.error = data['error'];
        this.loading = false;
        this.note = data['note'];
        this.terminal = data['terminal'];
        this.systemOnline = data['systemOnline'];
      },
      e => {
        console.log(e);
      },
    );
  }

  start() {
    this.router.navigate(['login']);
  }


}
