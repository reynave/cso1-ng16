import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../service/config.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-setting-ecr',
  templateUrl: './setting-ecr.component.html',
  styleUrls: ['./setting-ecr.component.css']
})
export class SettingEcrComponent implements OnInit {
  env_ecr: any;
  note: string = ""; 
  private _docSub: any;
  logs : any = []; 
  loading : boolean = false;
  serverBcaERC : string= environment.apiBCA
  bg: string = 'primary';
  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    
  ) { }

  ngOnInit(): void {
    this.setInit();
    this._docSub = this.configService.getMessage().subscribe(
      (data: { [x: string]: any; }) => {
        console.log(data);
        this.logs = data;
      }
    );
  }

  setInit() {
    this.env_ecr = localStorage.getItem("env_ecr");
  }

  fnSave() {
    this.bg = "primary";
    localStorage.setItem("env_ecr", this.env_ecr);
    this.setInit();
    this.note = "Save Done";
  }

  back() {
    history.back();
  }
  

  fnEchotest(){
    this.note = "";
    this.bg = "primary";
    this.loading = true;
    this.http.get<any>( this.serverBcaERC+"echoTest",{
      params : {
        ip :  this.env_ecr
      }
    }).subscribe(
      data=>{
        this.loading = false;
        console.log(data);
        this.logs = data['resp'];
        this.note = data['message'];
      },
      error=>{
        this.loading = false;
        console.log(error);
        this.bg = "danger";
        this.logs = error['error'];
        this.note = error['error']['message'];
      }
    )
  }
  randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  fnPayment(){
    this.loading = true;
    const body = {
      amount : this.randomIntFromInterval(10, 99),
      transType : "01",
      ip : this.env_ecr
    }
    this.http.post<any>( this.serverBcaERC+"payment",body).subscribe(
      data=>{
        this.loading = false;
        console.log(data);
        this.logs = data['resp'];
        this.note = data['message'];
      },
      error=>{
        this.loading = false;
        console.log(error);
      }
    )
  }
   
  ngOnDestroy(): void {
    console.log("ngOnDestroy"); 
    this._docSub.unsubscribe();
  }
}
