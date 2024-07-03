import { Component, OnInit } from '@angular/core';

declare var device: any; 
declare var screen: any;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    let onDeviceReady = () => {
      screen.orientation.lock('portrait');
      console.log("Cordova Ready! ver 1.0.1 Stable");
      console.log('cordova ', device.cordova);
      console.log('model ', device.model);
      console.log('platform ', device.platform);
      console.log('uuid ', device.uuid);
      console.log('manufacturer ', device.manufacturer);
      console.log('isVirtual ', device.isVirtual);
      console.log('serial ', device.serial); 
    };
    document.addEventListener('gesturestart', (event) => { event.preventDefault(); }, false);
    document.addEventListener('deviceready', onDeviceReady, false);

  }

}
