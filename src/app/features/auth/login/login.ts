import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { UserRole } from '../../../core/models/enums';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.notificationService.success('¡Bienvenido a AGROPURE!');
          const redirectUrl =
            response.user.role === UserRole.Admin ? '/dashboard' : '/';
          this.router.navigate([redirectUrl]);
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  fillCredentials(type: 'admin' | 'customer'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({
        email: 'admin@agropure.com',
        password: 'admin123',
      });
    } else {
      this.loginForm.patchValue({
        email: 'evazquez9904@gmail.com',
        password: 'customer123',
      });
    }
  }
}
