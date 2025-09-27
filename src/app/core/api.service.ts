import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Permit, ScanEvent } from '../models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  base = 'https://api.your-university.edu'; // ضبّطها

  constructor(private http: HttpClient) {}

  getPermit(permitId: string): Observable<Permit> {
    return this.http.get<Permit>(`${this.base}/permits/${permitId}`);
  }

  postScan(event: ScanEvent) {
    return this.http.post(`${this.base}/scans`, event);
  }

  getScans(query?: any) {
    const q = query ? ('?' + new URLSearchParams(query).toString()) : '';
    return this.http.get(`${this.base}/scans${q}`);
  }
}
