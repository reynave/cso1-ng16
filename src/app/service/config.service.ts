import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookiesService } from './cookies.service'; 
import { Socket } from 'ngx-socket-io';
import * as CryptoJS from "crypto-js";


@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  kioskUuid: string = "t1_kioskUuid";
  deviceUuidVar: string = 'deviceUuid';
  varToken: any = [];
  varHeaders: any = [];
  deviceInfo: any = null;
  api: string = environment.api;
  constructor(
    private cookies: CookiesService,
    private http: HttpClient,
    private socket: Socket, 

  ) {
    if (localStorage.getItem(this.deviceUuidVar) == null) {
      console.log("tidak ada session login");
    } else {
      this.varToken = this.keygen();
    }
  }

  printerName(): string {
    return "SCO1printerName";
  }

  logout() {

  }
  reloadToken() {
    this.varToken = this.keygen();
  }

  sendMessage(data: any) {
    this.socket.emit('data', data);
  }
  getMessage(): any {
    return this.socket.fromEvent('emiter');
  }
  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  help(data: any) {
    const msg = {
      to: 'supervisor',
      msg: 'Help! Terminal ID :' + data['terminalId'],
      action: 'help',
    }
    this.sendMessage(msg);
  }

  getKioskUuid() {
    return this.kioskUuid;
  }
  myUUID() {
    return this.kioskUuid;
  }
  deviceUuid() {
    return this.deviceUuidVar;
  }

  headers() {
    this.reloadToken();
    return this.varHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Token': this.keygen(),
    });
  }
  token() {
    return localStorage.getItem(this.deviceUuidVar);
  }

  id_user() {
    this.reloadToken();
    return this.varToken;
  }


  errorToken(data: { [x: string]: number; }) {
    if (data['error'] == 400) {
      //  window.location.href = "login";
    }

  }


  sytemOff() {
    let url = this.api + 'kioskLogin/index/?token=' + localStorage.getItem(this.deviceUuidVar);
    return this.http.get<any>(url);
  }


  httpAccount() {
    this.reloadToken();
    let url = this.api + 'Kiosks/index/?token=' + this.keygen();

    return this.http.get<any>(url,
      { headers: this.headers() }
    );

  }

  reverseString(str: string) {
    // Step 1. Use the split() method to return a new array
    let splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]

    // Step 2. Use the reverse() method to reverse the new created array
    let reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]

    // Step 3. Use the join() method to join all elements of the array into a string
    let joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"

    //Step 4. Return the reversed string
    return joinArray; // "olleh"
  }


  agent() {
 
    const data = {
      getDeviceInfo: false,
      isMobile: false,
      isTablet: true,
      isDesktopDevice: true,
    }
    console.log(data);
    return data;
  }

  keygen() {
    let token: any = false;
    let data: any = localStorage.getItem(this.deviceUuid());
    if (data != '' && data != null) {
      let word = this.reverseString(data);
      const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(word));
      const md5 = hash.toString(CryptoJS.enc.Hex);
      token = data + "-" + md5;

    }
    return token;
  }

  printer() {
    let data: any = localStorage.getItem(this.printerName());
    if (data != '' && data != null) {
      return data;
    } else {
      return null;
    }

  }

  ecrRespCode(code: string = "") {
    let note = "";
    if (code == '00') {
      note = "Approve, Payment Success.";
    }
    
    if (code == 'Q2') {
      note = "Transaksi tidak ditemukan!";
    }

    if (code == '54') {
      note = "Decline Expired Card " + code;
    }
    if (code == '55') {
      note = "Decline Incorrect PIN " + code;
    }
    if (code == 'P2') {

      note = " Read Card Error " + code;
    }

    if (code == 'P3') {
      note = " User press Cancel on EDC " + code;
    }

    if (code == 'Z3') {

      note = " EMV Card Decline " + code;
    }

    if (code == 'CE') {

      note = " Connection Error/Line Busy " + code;
    }

    if (code == 'TO') {

      note = " Connection Timeout " + code;
    }

    if (code == 'PT') {

      note = " EDC Problem " + code;
    }

    if (code == 'aa' || code == 'AA') {

      note = "aa Decline (aa represent two digit alphanumeric value from EDC)" + code;
    }

    if (code == 'S2') {

      note = " TRANSAKSI GAGAL, ULANGI TRANSAKSI DI EDC " + code;
    }

    if (code == 'S3') {

      note = " TXN BLM DIPROSES, MINTA SCAN QR, S4 TXN EXPIRED " + code;
    }
    if (code == 'ERRCON') {

      note = code + " ERROR CONNECTION, ECR is not connect!";
    }
    if (code == 'ER01') {
      note = " Connection Timeout, Please refresh pages " + code;
    }
    if (code == 'IPDEAD') {
      note = code + " :  IP Terminal to ECR is dead or not found! ";
    }
    return note;
  }




}
