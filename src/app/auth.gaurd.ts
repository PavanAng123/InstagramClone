import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })


export class Authgaurd implements CanActivate{
    localStorage: any;

    constructor(private authservice: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const isloggedin = !!localStorage.getItem('localId')
        if (!isloggedin) {
            this.router.navigate(['/login'])
            this.localStorage.removeItem('localId');
            return false
            

        } else {
            return true;
        }
    }

}