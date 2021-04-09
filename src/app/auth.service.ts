import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

import { User } from './User';
import { RegisterUser } from './RegisterUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public getToken(): string {
    return localStorage.getItem('access_token');
  }

  public readToken(): User {
    const token = localStorage.getItem('access_token');
    return helper.decodeToken(token);
  }

  public isAuthenticated(): Boolean {
    const token = localStorage.getItem('access_token');

    if (token) {
      console.log('token exists');
      return true;
    } else {
      console.log('no token');
      return false;
    }
  }

  public login(user): Observable<any> {
    return this.http.post<any>(`${environment.userAPIBase}/login`, user);
  }

  public logout(): void {
    localStorage.removeItem('access_token');
  }

  public register(user): Observable<any> {
    return this.http.post<any>(`${environment.userAPIBase}/register`, user);
  }
}
