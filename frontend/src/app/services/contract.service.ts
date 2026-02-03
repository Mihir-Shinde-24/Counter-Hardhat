import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private apiUrl = 'http://localhost:3000/api';
  private countSubject = new BehaviorSubject<number>(0);
  
  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCount();
  }

  loadCount() {
    this.http.get<{ count: string }>(`${this.apiUrl}/count`)
      .subscribe(response => {
        this.countSubject.next(Number(response.count));
      });
  }

  increment(): Observable<any> {
    return new Observable(observer => {
      this.http.post<{ count: string, transactionHash: string }>(
        `${this.apiUrl}/increment`, 
        {}
      ).subscribe({
        next: (response) => {
          this.countSubject.next(Number(response.count));
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  getContractAddress(): Observable<{ address: string }> {
    return this.http.get<{ address: string }>(`${this.apiUrl}/contract-info`);
  }
}