import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="page-shell">
      <header class="topbar">
        <div class="brand-block">
          <div class="brand-mark">A</div>
          <div>
            <p class="eyebrow">AI-driven crop intelligence</p>
            <h1>AgroConnect</h1>
          </div>
        </div>
        <button class="primary-btn">Diagnose crop</button>
      </header>

      <main class="content-grid">
        <section class="hero-card">
          <div class="copy">
            <span class="badge">PWA-ready agritech platform</span>
            <h2>Detect disease early and act with confidence.</h2>
            <p>
              AgroConnect helps farmers detect crop disease from images, retrieve treatment guidance,
              and access multilingual recommendations for smarter decision-making.
            </p>
            <div class="cta-row">
              <button class="primary-btn">Start diagnosis</button>
              <button class="secondary-btn">View insights</button>
            </div>
          </div>

          <div class="stats-panel">
            <div class="stat-box">
              <span class="stat-label">Disease classes</span>
              <strong>450+</strong>
            </div>
            <div class="stat-box">
              <span class="stat-label">Regions covered</span>
              <strong>India</strong>
            </div>
            <div class="stat-box accent">
              <span class="stat-label">Response flow</span>
              <strong>ResNet50 + RAG</strong>
            </div>
          </div>
        </section>

        <section class="feature-grid">
          <article class="feature-card">
            <h3>AI disease detection</h3>
            <p>Use crop images and similarity-based matching with ResNet50-based embeddings.</p>
          </article>
          <article class="feature-card">
            <h3>RAG treatment assistant</h3>
            <p>Retrieve and summarize agronomic guidance for symptoms, causes, and treatment.</p>
          </article>
          <article class="feature-card">
            <h3>Multilingual guidance</h3>
            <p>Support additional language flows to improve accessibility for farmers.</p>
          </article>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .page-shell {
        max-width: 1200px;
        margin: 0 auto;
        padding: 32px 24px 72px;
      }

      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 28px;
      }

      .brand-block {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .brand-mark {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, var(--primary), #57aa6d);
        color: white;
        border-radius: 12px;
        font-weight: 800;
        box-shadow: var(--shadow);
      }

      .eyebrow {
        margin: 0;
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      h1 {
        margin: 2px 0 0;
        font-size: clamp(1.4rem, 2vw, 2rem);
      }

      .primary-btn, .secondary-btn {
        border: none;
        border-radius: 12px;
        padding: 0.8rem 1.2rem;
        font-weight: 700;
        cursor: pointer;
      }

      .primary-btn {
        background: var(--primary);
        color: white;
        box-shadow: var(--shadow);
      }

      .secondary-btn {
        background: transparent;
        border: 1px solid var(--border);
        color: var(--text);
      }

      .content-grid {
        display: grid;
        gap: 22px;
      }

      .hero-card {
        background: var(--panel);
        border: 1px solid var(--border);
        border-radius: 24px;
        box-shadow: var(--shadow);
        padding: 28px;
        display: grid;
        grid-template-columns: 1.4fr 0.8fr;
        gap: 20px;
      }

      .copy h2 {
        margin: 12px 0 14px;
        font-size: clamp(2rem, 4vw, 3.2rem);
        line-height: 1.1;
      }

      .copy p {
        margin: 0;
        color: var(--muted);
        font-size: 1.05rem;
        line-height: 1.7;
      }

      .badge {
        display: inline-flex;
        background: var(--accent);
        color: var(--primary-strong);
        border: 1px solid rgba(43, 122, 75, 0.12);
        border-radius: 999px;
        padding: 0.42rem 0.8rem;
        font-size: 0.76rem;
        font-weight: 700;
      }

      .cta-row {
        display: flex;
        gap: 12px;
        margin-top: 24px;
      }

      .stats-panel {
        display: grid;
        gap: 14px;
        align-content: center;
      }

      .stat-box {
        background: var(--panel-alt);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 18px;
      }

      .stat-box.accent {
        background: linear-gradient(135deg, #edf7f0, #ebf3ff);
      }

      .stat-label {
        display: block;
        color: var(--muted);
        margin-bottom: 8px;
      }

      strong {
        font-size: 1.4rem;
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .feature-card {
        background: rgba(255,255,255,0.65);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 18px;
        box-shadow: var(--shadow);
      }

      .feature-card h3 {
        margin-top: 0;
        margin-bottom: 10px;
      }

      .feature-card p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }

      @media (max-width: 900px) {
        .hero-card {
          grid-template-columns: 1fr;
        }

        .feature-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AppComponent {}
