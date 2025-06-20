import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="alert" [ngClass]="type">
      <span>{{ message }}</span>
      <button class="close" (click)="dismiss.emit()">×</button>
    </div>
  `,
  styles: [`
    .alert {
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      margin: 1rem auto;
      max-width: 500px;
      background: #ffeded;
      color: #a20000;
      border: 1px solid #ff8080;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
    }
    .alert.success {
      background: #e7faed;
      color: #157145;
      border-color: #19d27b;
    }
    .close {
      background: transparent;
      border: none;
      color: inherit;
      font-size: 1.4rem;
      cursor: pointer;
      margin-left: 1rem;
    }
  `]
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'error';
  @Output() dismiss = new EventEmitter<void>();
}
