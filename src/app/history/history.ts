import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history',
  imports: [DatePipe, CommonModule, RouterLink],
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {
  logs: any[] = [];
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.api.getScans().subscribe({
      next: (res: any) => {
        this.logs = res || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
