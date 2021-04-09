import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerUser: any;

  warning;
  success: Boolean;
  loading: Boolean;
  authServiceSub: any;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (
      this.registerUser.userName != '' &&
      this.registerUser.password == this.registerUser.password2
    ) {
      console.log('inside submit');
      this.loading = true;
      this.authServiceSub = this.authService
        .register(this.registerUser)
        .subscribe(
          (data) => {
            this.success = true;
            this.warning = null;
            this.loading = false;
          },
          (err) => {
            this.success = false;
            this.warning = err.error.message;
            this.loading = false;
          },
          () => {}
        );
    } else if (this.registerUser.password != this.registerUser.password2) {
      this.warning = 'Passwords do not match! Try again!';
    }
  }
  ngOnInit(): void {
    this.registerUser = {
      userName: '',
      password: '',
      password2: '',
    };
    this.success = false;
    this.loading = false;
  }
}
