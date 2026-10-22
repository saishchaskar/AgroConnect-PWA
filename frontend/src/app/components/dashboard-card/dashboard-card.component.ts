import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  template: `
    <article class="dashboard-card">
      <div class="card-header">
        <h3>{{ title }}</h3>
      </div>

      <ul class="item-list">
        <li *ngFor="let item of items">{{ item }}</li>
      </ul>
    </article>
  `,
  styles: [
    `
      .dashboard-card {
        background: rgba(255,255,255,0.85);
        border: 1px solid #dfe9df;
        border-radius: 20px;
        padding: 18px;
        box-shadow: 0 16px 32px rgba(23, 58, 32, 0.04);
      }

      .card-header {
        margin-bottom: 12px;
      }

      h3 {
        margin: 0;
        font-size: 1.15rem;
      }

      .item-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 12px;
      }

      li {
        background: #f6faf7;
        border: 1px solid #e5efe5;
        border-radius: 12px;
        padding: 12px 14px;
        color: #465d52;
      }
    `
  ]
})
export class DashboardCardComponent {
  @Input() title = 'Insights';
  @Input() items: string[] = [];
}
