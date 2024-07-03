import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../service/config.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(
    private router: Router,
    private configService: ConfigService,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.router.navigate(['']).then(
      () => {
        //localStorage.removeItem("deviceUuid");
        localStorage.removeItem("t1_kioskUuid");

        this.configService.reloadToken();
      }
    );
  }
}
