import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BottomNavComponent],
  template: `
    <div class="history-page">
      <header class="header">
        <button class="back-btn" routerLink="/home">← Dashboard</button>
        <h1>Diagnosis History</h1>
      </header>

      <div class="search-bar">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          placeholder="Search by crop or disease..."
          class="search-input"
        />
      </div>

      <div *ngIf="loading" class="status">Loading scan history...</div>
      <div *ngIf="!loading && filteredItems.length === 0" class="status">
        No scans found. <a routerLink="/scan">Scan your first crop leaf →</a>
      </div>

      <div class="list">
        <div *ngFor="let item of filteredItems" class="card" (click)="openResult(item.id)">
          <div class="card-info">
            <h3>{{ item.diseaseName || 'Unknown Condition' }}</h3>
            <p class="crop">{{ item.cropName || 'Crop' }} • {{ item.createdAt | date:'mediumDate' }}</p>
            <span class="badge" [class.healthy]="item.healthy">
              {{ item.healthy ? 'Healthy' : (item.severity || 'Detected') }}
            </span>
          </div>
          <button class="del-btn" (click)="deleteItem($event, item.id)" title="Delete">🗑️</button>
        </div>
      </div>

      <app-bottom-nav></app-bottom-nav>
    </div>
  `,
  styles: [`
    .history-page { max-width: 680px; margin: 0 auto; padding: 1rem 1rem 5.5rem; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
    .back-btn { background: none; border: none; color: #1b4332; font-weight: 600; cursor: pointer; }
    h1 { font-size: 1.35rem; margin: 0; color: #1b4332; }
    .search-input {
      width: 100%; padding: 0.7rem 0.9rem; border: 1px solid #cbd5e1;
      border-radius: 10px; font-size: 0.95rem; margin-bottom: 1rem; box-sizing: border-box;
    }
    .status { text-align: center; color: #64748b; padding: 2rem 0; }
    .list { display: flex; flex-direction: column; gap: 0.75rem; }
    .card {
      display: flex; justify-content: space-between; align-items: center;
      background: #fff; border: 1px solid #e2e8f0; border-radius: 12px;
      padding: 0.9rem 1rem; cursor: pointer;
    }
    .card h3 { margin: 0 0 0.25rem; font-size: 1.05rem; color: #0f172a; }
    .crop { margin: 0 0 0.4rem; font-size: 0.85rem; color: #64748b; }
    .badge {
      display: inline-block; padding: 0.15rem 0.55rem; border-radius: 999px;
      font-size: 0.75rem; font-weight: 600; background: #fee2e2; color: #991b1b;
    }
    .badge.healthy { background: #dcfce7; color: #166534; }
    .del-btn { background: none; border: none; font-size: 1.1rem; cursor: pointer; padding: 0.4rem; }
  `]
})
export class HistoryComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  items: any[] = [];
  searchQuery = '';
  loading = true;

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/history`).subscribe({
      next: (data) => { this.items = data || []; this.loading = false; },
      error: () => { this.items = []; this.loading = false; }
    });
  }

  get filteredItems(): any[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter(i =>
      (i.diseaseName || '').toLowerCase().includes(q) ||
      (i.cropName || '').toLowerCase().includes(q)
    );
  }

  openResult(id: number): void {
    this.router.navigate(['/result', id]);
  }

  deleteItem(event: Event, id: number): void {
    event.stopPropagation();
    this.http.delete(`${environment.apiBaseUrl}/api/history/${id}`).subscribe({
      next: () => { this.items = this.items.filter(i => i.id !== id); }
    });
  }
}
