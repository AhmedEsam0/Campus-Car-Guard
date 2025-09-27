import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { gsap } from 'gsap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngAfterViewInit() {
    // entrance animation
    gsap.from('.login-card', { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' });
  }

  login() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.email, this.password).subscribe(res => {
      this.loading = false;
      if (res && res.user) {
        // success animation
        gsap.to('.login-card', { scale: 0.98, duration: 0.15, yoyo: true, repeat: 1 });
        this.router.navigate(['/scan']);
      } else {
        this.error = 'فشل تسجيل الدخول — تحقّق من البيانات';
        gsap.fromTo('.error-msg', { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
      }
    }, () => {
      this.loading = false;
      this.error = 'حدث خطأ في الاتصال';
    });
  }
}
