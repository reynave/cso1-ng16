import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from './../service/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private router: Router
  ) {
    // console.log('token : '+this.configService.token());
   // console.log(this.configService.accessRightGet());

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

   

    if (this.configService.token()) {

      if (next.data['active'] != 'home') { 

        let index = this.configService.accessRightGet().findIndex(((obj: { module: any; }) => obj.module == next.data['active']));

        if (this.configService.accessRightGet()[index]['_access'] == 1) {
          return true;
        } else {
          console.log("You dont vhave access this module!");
          this.router.navigate(['/forbiden']);
          return false;
        }
      }else{
        return true;
      }
     
    } else {
      console.log("Relogin please!");
      this.router.navigate(['/relogin']);

      return false;

    }
  }

}
