import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user: any;
  warning;
  loading: Boolean;
  authServiceSub: any;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (this.user.userName != '' && this.user.password != '') {
      this.loading = true;
      this.authServiceSub = this.authService.login(this.user).subscribe(
        (data) => {
          localStorage.setItem('access_token', data.token);
          this.router.navigate(['/newReleases']);
        },
        (err) => {
          this.warning = err.error.message;
          this.loading = false;
        }
      );
    }
  }

  ngOnInit(): void {
    this.user = {
      userName: '',
      password: '',
      _id: null,
    };
    this.loading = false;
  }
}
