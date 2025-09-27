import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Permit, ScanEvent } from '../models';
import { FormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-scan',
  imports: [FormsModule, ZXingScannerModule, CommonModule],
  templateUrl: './scan.html',
  styleUrl: './scan.css',
})
export class Scan implements OnInit {
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice?: MediaDeviceInfo;
  lastResult: string | null = null;
  foundPermit: Permit | null = null;
  showModal = false;
  direction: 'in' | 'out' = 'in';
  actionReason = '';
  isProcessing = false;
  toastMsg = '';
  toastType: 'success' | 'danger' | 'info' = 'info';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit() {}

  onCamerasFound(devices: MediaDeviceInfo[]) {
    this.availableDevices = devices;
    if (devices && devices.length) this.currentDevice = devices[0];
  }

  onScanSuccess(result: string) {
    if (!result) return;
    if (this.lastResult === result) return;
    this.lastResult = result;
    const permitId = result.trim();
    this.isProcessing = true;
    this.api.getPermit(permitId).subscribe({
      next: (p) => {
        this.foundPermit = p;
        this.showModal = true;
        this.isProcessing = false;
        // modal intro animation
        gsap.fromTo(
          '.scan-modal',
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }
        );
      },
      error: () => {
        this.isProcessing = false;
        this.showToast('تصريح غير موجود أو غير صالح', 'danger');
      },
    });
  }

  confirm(action: 'allow' | 'deny') {
    if (!this.foundPermit) {
      this.showToast('لا يوجد تصريح مفعل، أعد المسح', 'danger');
      return;
    }
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      this.showToast('يجب تسجيل الدخول أولاً', 'danger');
      return;
    }

    const payload: ScanEvent = {
      permitId: this.foundPermit.permitId,
      guardId: currentUser.id,
      action,
      reason: this.actionReason,
      direction: this.direction,
      timestamp: new Date().toISOString(),
    };

    this.isProcessing = true;
    this.api.postScan(payload).subscribe({
      next: () => {
        this.isProcessing = false;
        this.showModal = false;
        this.actionReason = '';
        this.foundPermit = null;
        this.lastResult = null;
        this.showToast(
          action === 'allow' ? 'تم السماح بالدخول' : 'تم رفض الدخول',
          action === 'allow' ? 'success' : 'danger'
        );
        // success pulse
        gsap.fromTo(
          '.top-bar',
          { scale: 0.98 },
          { scale: 1.02, duration: 0.2, yoyo: true, repeat: 1 }
        );
      },
      error: () => {
        this.isProcessing = false;
        this.showToast('خطأ أثناء تسجيل العملية', 'danger');
      },
    });
  }

  showToast(msg: string, type: 'success' | 'danger' | 'info' = 'info') {
    this.toastMsg = msg;
    this.toastType = type;
    const el = document.querySelector('.app-toast') as HTMLElement | null;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    setTimeout(() => {
      gsap.to(el, { y: -30, opacity: 0, duration: 0.4 });
    }, 2500);
  }

  logout() {
    // نظيف وآمن: نطلب من الـ auth يسجل الخروج، ثم نستخدم Router للتوجيه داخل التطبيق
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
