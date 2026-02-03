import { Component, OnInit } from '@angular/core';
import { ContractService } from '../../services/contract.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="counter-container">
      <h1>Blockchain Counter</h1>
      
      <div class="counter-display">
        <p>Current Count: <span class="count">{{ count }}</span></p>
        <p class="contract-info" *ngIf="contractAddress">
          Contract: {{ contractAddress }}
        </p>
      </div>
      
      <button (click)="incrementCounter()" [disabled]="loading" class="increment-btn">
        {{ loading ? 'Processing...' : 'Increment Counter' }}
      </button>
      
      <div *ngIf="lastTransaction" class="transaction-info">
        <p>Last Transaction: {{ lastTransaction }}</p>
      </div>
      
      <div *ngIf="error" class="error-message">
        {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .counter-container {
      text-align: center;
      padding: 2rem;
      font-family: Arial, sans-serif;
    }
    
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    
    .counter-display {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .count {
      font-size: 2.5rem;
      font-weight: bold;
      color: #2196F3;
    }
    
    .contract-info {
      font-size: 0.9rem;
      color: #666;
      word-break: break-all;
      margin-top: 1rem;
    }
    
    .increment-btn {
      background: #2196F3;
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1.1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .increment-btn:hover:not(:disabled) {
      background: #1976D2;
    }
    
    .increment-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    .transaction-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #e8f5e9;
      border-radius: 4px;
      color: #2e7d32;
    }
    
    .error-message {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #ffebee;
      border-radius: 4px;
      color: #c62828;
    }
  `]
})
export class CounterComponent implements OnInit {
  count = 0;
  loading = false;
  lastTransaction: string | null = null;
  error: string | null = null;
  contractAddress: string | null = null;

  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.contractService.count$.subscribe(count => {
      this.count = count;
    });

    this.contractService.getContractAddress().subscribe(
      response => this.contractAddress = response.address
    );
  }

  incrementCounter() {
    this.loading = true;
    this.error = null;
    
    this.contractService.increment().subscribe({
      next: (response) => {
        this.lastTransaction = response.transactionHash;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.error || 'Transaction failed';
        this.loading = false;
      }
    });
  }
}