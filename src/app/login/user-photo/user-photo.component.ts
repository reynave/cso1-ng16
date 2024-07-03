import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgZone } from '@angular/core';

// declare function haha(): any;
declare let navigator: any;
// declare let cordova: any;
declare let Camera: any;

@Component({
  selector: 'app-user-photo',
  templateUrl: './user-photo.component.html',
  styleUrls: ['./user-photo.component.css']
})
export class UserPhotoComponent implements OnInit {
  api: string = environment.api;
  device: boolean = environment.device;
  kioskUuid: any = localStorage.getItem(this.configService.myUUID());
  storeOutlesId: string = "";
  terminalId: string = "";
  version: string = environment.version;
  today: any = new Date();
  loading: boolean = false;
  images: string = "./assets/imgs/user.png";
  initPhoto: boolean = false;
  memberId: string = "0";
  name: string = "";
  notes: string = "";
  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private configService: ConfigService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    config: NgbModalConfig,
    private ngZone: NgZone
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.configService.httpAccount().subscribe(
      data => {
        this.storeOutlesId = data['storeOutlesId'];
        this.terminalId = data['terminalId'];
      }
    );
    this.httpGet();
  }

  tnc: any = [];
  httpGet() {

    let url = this.api + 'kioskLogin/getInfo/?kioskUuid=' + this.kioskUuid;
    console.log(url);
    this.http.get<any>(url,
      { headers: this.configService.headers() }
    ).subscribe(
      data => {
        console.log(data);
        this.tnc = data['tnc'];
        this.memberId = data['memberId'];
        this.name = data['name'];
        this.notes = data['welcomeMember'];
      },
      e => {
        console.log(e);
      },
    );
  }

  open(content: any) {
    this.modalService.open(content, { size: 'lg' });
  }

  takePhoto() {
    const options = {
      destinationType: Camera.DestinationType.DATA_URL,
      quality: 50,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
    };
    let self = this;

    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, options);

  }

  cameraSuccess = (imagesData: any) => {
    this.initPhoto = true;
    this.loading = false;
    this.ngZone.run(() => {
      this.images = 'data:image/png;base64,' + imagesData;
      this.goToCart();
    }

    );

  }

  cameraError = (e: any) => {
    console.log('error Camera', e);
    this.initPhoto = false;
  }
  fnSkipPhoto() {
    this.initPhoto = true;
  }

  goToCart() {
    if (this.initPhoto == true) {
      const body = {
        base64Images: this.images,
        kioskUuid: this.kioskUuid,
      }
      this.http.post<any>(this.api + 'kioskLogin/takePhoto/', body,
        { headers: this.configService.headers() }
      ).subscribe(
        data => {
          // this.modalService.open(loginVisitor); 
          console.log(data);
          this.loading = false;
          this.router.navigate(['cart'], { queryParams: { kioskUuid: this.kioskUuid }, });
        },
        e => {
          console.log(e);
        },
      );


    }

  }

  ngOnDestroy(): void {
    this.modalService.dismissAll();
  }


}
