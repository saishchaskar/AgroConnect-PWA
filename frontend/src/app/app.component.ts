import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand-wrap">
          <div class="brand-mark">A</div>
          <div>
            <p class="eyebrow">AI-driven crop intelligence</p>
            <h1>AgroConnect</h1>
          </div>
        </div>
        <button class="primary-btn">Diagnose crop</button>
      </header>

      <main class="dashboard-layout">
        <section class="hero-panel">
          <div class="hero-copy">
            <span class="badge">PWA-ready agri platform</span>
            <h2>Early plant disease detection for better farm decisions.</h2>
            <p>
              Upload crop images, identify disease risk using AI, and receive actionable treatment guidance
              powered by agronomy data and retrieval-augmented generation.
            </p>
            <div class="cta-row">
              <button class="primary-btn">Start diagnosis</button>
              <button class="secondary-btn">View dashboard</button>
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <span class="metric-label">Disease classes</span>
              <strong>450+</strong>
            </div>
            <div class="metric-card">
              <span class="metric-label">Regions</span>
              <strong>India</strong>
            </div>
            <div class="metric-card highlight">
              <span class="metric-label">AI stack</span>
              <strong>ResNet50 + RAG</strong>
            </div>
          </div>
        </section>

        <section class="content-grid">
          <app-diagnosis-form></app-diagnosis-form>
          <app-dashboard-card title="Recent insights" [items]="insights"></app-dashboard-card>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
      }

      .app-shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 24px 20px 72px;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 28px;
      }

      .brand-wrap {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .brand-mark {
        width: 46px;
        height: 46px;
        border-radius: 12px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, #1f7a45, #5fa96f);
        color: white;
        font-weight: 800;
        box-shadow: 0 16px 32px rgba(26, 79, 35, 0.18);
      }

      .eyebrow {
        font-size: 10px;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: #54705f;
        margin: 0;
      }

      h1 {
        margin: 0;
        font-size: clamp(1.4rem, 2vw, 2rem);
      }

      .hero-panel {
        display: grid;
        grid-template-columns: 1.5fr 0.8fr;
        gap: 20px;
        background: rgba(255,255,255,0.85);
        border: 1px solid #dfe8dc;
        border-radius: 26px;
        padding: 28px;
        box-shadow: 0 24px 48px rgba(21, 62, 32, 0.08);
      }

      .badge {
        display: inline-flex;
        background: #eaf7ec;
        color: #1f5a39;
        border: 1px solid #cfe6d1;
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 700;
      }

      h2 {
        margin: 16px 0 12px;
        font-size: clamp(2.1rem, 4vw, 3.3rem);
        line-height: 1.08;
      }

      .hero-copy p {
        margin: 0;
        color: #54635e;
        line-height: 1.8;
        font-size: 1.04rem;
      }

      .cta-row {
        display: flex;
        gap: 12px;
        margin-top: 26px;
      }

      .primary-btn, .secondary-btn {
        border: none;
        border-radius: 12px;
        padding: 0.85rem 1.2rem;
        font-weight: 700;
        cursor: pointer;
      }

      .primary-btn {
        background: linear-gradient(135deg, #1f7a45, #4eaa69);
        color: white;
        box-shadow: 0 18px 30px rgba(31, 122, 69, 0.22);
      }

      .secondary-btn {
        background: transparent;
        border: 1px solid #d8e4d9;
        color: #163421;
      }

      .metrics-grid {
        display: grid;
        align-content: center;
        gap: 16px;
      }

      .metric-card {
        background: #f3faf3;
        border: 1px solid #dfe9df;
        padding: 18px;
        border-radius: 18px;
      }

      .metric-card.highlight {
        background: linear-gradient(135deg, #edf9f0, #ecf3ff);
      }

      .metric-label {
        display: block;
        color: #557062;
        margin-bottom: 8px;
      }

      strong {
        font-size: 1.5rem;
      }

      .content-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 20px;
        margin-top: 22px;
      }

      @media (max-width: 900px) {
        .hero-panel,
        .content-grid {
          grid-template-columns: 1fr;
        }

        .topbar {
          flex-direction: column;
          align-items: flex-start;
          gap: 14px;
        }
      }
    `
  ]
})
export class AppComponent {
  insights = [
    'AI disease prediction is ready for crop image uploads',
    'RAG responses can surface symptoms, causes, and treatment plans',
    'PWA support is planned for field-friendly mobile access'
  ];
}

import { Component, Input } from '@angular/core';
