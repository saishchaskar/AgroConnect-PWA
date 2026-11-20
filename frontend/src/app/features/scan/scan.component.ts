import {
  Component, OnInit, OnDestroy, ViewChild,
  ElementRef, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DiagnosisService } from '../../services/diagnosis.service';
import { DiagnosisResponse } from '../../models/diagnosis.model';

@Component({
  selector: 'app-scan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="screen">
      <!-- Header -->
      <header class="header">
        <button class="back-btn" routerLink="/home">← Dashboard</button>
        <h1 class="header-title">Scan Crop</h1>
        <div style="width:80px"></div>
      </header>

      <div class="content">
        <!-- Camera / Image Area -->
        <div class="camera-area" (click)="onCameraAreaClick()">
          <!-- Video live preview -->
          <video
            #videoEl
            class="camera-video"
            autoplay
            playsinline
            muted
            *ngIf="cameraActive && !previewUrl"
          ></video>

          <!-- Image preview -->
          <img
            class="image-preview"
            [src]="previewUrl"
            alt="Selected crop image"
            *ngIf="previewUrl"
          />

          <!-- Placeholder -->
          <div class="camera-placeholder" *ngIf="!cameraActive && !previewUrl">
            <span class="placeholder-icon">📷</span>
            <p class="placeholder-text">Tap to capture or upload</p>
          </div>

          <!-- Canvas for capture (hidden) -->
          <canvas #canvasEl class="hidden-canvas"></canvas>
        </div>

        <!-- Action buttons -->
        <div class="action-row">
          <button class="action-btn" (click)="openCamera()" [disabled]="analyzing">
            📷 Take Photo
          </button>
          <button class="action-btn" (click)="triggerFileInput()" [disabled]="analyzing">
            📁 Upload Photo
          </button>
        </div>

        <!-- Hidden file input -->
        <input
          #fileInput
          type="file"
          accept="image/*"
          capture="environment"
          class="hidden-input"
          (change)="onFileSelected($event)"
        />

        <!-- Analyze button -->
        <button
          class="analyze-btn"
          *ngIf="selectedFile && !analyzing"
          (click)="analyze()"
        >
          🔍 Analyze Crop
        </button>

        <!-- Loading state -->
        <div class="loading-state" *ngIf="analyzing">
          <div class="spinner"></div>
          <p class="loading-text">Analyzing with AI...</p>
        </div>

        <!-- Error -->
        <p class="error-text" *ngIf="errorMsg">{{ errorMsg }}</p>

        <!-- Optional details -->
        <div class="details-section" *ngIf="selectedFile">
          <button class="details-toggle" (click)="showDetails = !showDetails">
            {{ showDetails ? '▾' : '▸' }} Add details (optional)
          </button>

          <div class="details-form" *ngIf="showDetails">
            <div class="form-group">
              <label class="form-label">Crop Type</label>
              <select [(ngModel)]="cropType" class="form-select">
                <option value="">Select crop...</option>
                <option value="Rice">Rice</option>
                <option value="Wheat">Wheat</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Cotton">Cotton</option>
                <option value="Maize">Maize</option>
                <option value="Sugarcane">Sugarcane</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Location</label>
              <input
                type="text"
                [(ngModel)]="location"
                placeholder="e.g. Pune, Maharashtra"
                class="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .screen {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      max-width: 480px;
      margin: 0 auto;
      background: #f4faf5;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #fff;
      border-bottom: 1px solid #e2eed4;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .back-btn {
      background: none;
      border: none;
      font-size: 14px;
      color: #1f7a45;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
    }

    .header-title { font-size: 18px; font-weight: 700; color: #111; margin: 0; }

    .content { flex: 1; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }

    .camera-area {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 20px;
      border: 2px dashed #4eaa69;
      background: #f0fdf4;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .camera-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .image-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .camera-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: #6b7280;
    }

    .placeholder-icon { font-size: 48px; }

    .placeholder-text { font-size: 15px; font-weight: 500; margin: 0; }

    .hidden-canvas { display: none !important; }
    .hidden-input { display: none !important; }

    .action-row { display: flex; gap: 12px; }

    .action-btn {
      flex: 1;
      padding: 13px;
      background: #fff;
      border: 1.5px solid #d1d5db;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      cursor: pointer;
      transition: background 0.15s;
    }

    .action-btn:hover:not(:disabled) { background: #f9fafb; }
    .action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .analyze-btn {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #1f7a45, #4eaa69);
      color: #fff;
      border: none;
      border-radius: 14px;
      font-size: 17px;
      font-weight: 700;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.1s;
      box-shadow: 0 4px 16px rgba(31,122,69,0.25);
    }

    .analyze-btn:hover { opacity: 0.92; transform: translateY(-1px); }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 20px;
    }

    .spinner {
      width: 36px; height: 36px;
      border: 4px solid #e2eed4;
      border-top-color: #1f7a45;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .loading-text { font-size: 15px; color: #6b7280; font-weight: 500; margin: 0; }

    .error-text { color: #dc2626; font-size: 14px; text-align: center; }

    .details-section { display: flex; flex-direction: column; gap: 12px; }

    .details-toggle {
      background: none;
      border: none;
      color: #1f7a45;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      padding: 0;
    }

    .details-form { display: flex; flex-direction: column; gap: 12px; }

    .form-group { display: flex; flex-direction: column; gap: 6px; }

    .form-label { font-size: 13px; font-weight: 600; color: #374151; }

    .form-select, .form-input {
      padding: 11px 14px;
      border: 1.5px solid #d1d5db;
      border-radius: 10px;
      font-size: 14px;
      background: #f9fafb;
      outline: none;
    }

    .form-select:focus, .form-input:focus { border-color: #1f7a45; background: #fff; }
  `]
})
export class ScanComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private diagnosisService = inject(DiagnosisService);
  private router = inject(Router);

  cameraActive = false;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  analyzing = false;
  errorMsg = '';
  showDetails = false;
  cropType = '';
  location = '';

  private stream: MediaStream | null = null;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stopCamera();
  }

  onCameraAreaClick(): void {
    if (!this.cameraActive && !this.previewUrl) {
      this.openCamera();
    } else if (this.cameraActive) {
      this.capturePhoto();
    }
  }

  async openCamera(): Promise<void> {
    this.errorMsg = '';
    if (this.previewUrl) {
      this.clearPreview();
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.cameraActive = true;
      // Wait for view to update
      setTimeout(() => {
        if (this.videoEl?.nativeElement) {
          this.videoEl.nativeElement.srcObject = this.stream;
        }
      }, 100);
    } catch (err: any) {
      this.errorMsg = 'Camera access denied. Please use the Upload button.';
    }
  }

  capturePhoto(): void {
    const video = this.videoEl?.nativeElement;
    const canvas = this.canvasEl?.nativeElement;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        this.selectedFile = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        this.previewUrl = URL.createObjectURL(blob);
        this.stopCamera();
        this.cameraActive = false;
      }
    }, 'image/jpeg', 0.9);
  }

  triggerFileInput(): void {
    this.stopCamera();
    this.cameraActive = false;
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile = file;
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(file);
    this.errorMsg = '';
  }

  async analyze(): Promise<void> {
    if (!this.selectedFile) return;
    this.analyzing = true;
    this.errorMsg = '';

    this.diagnosisService.diagnose(
      this.selectedFile,
      this.cropType || undefined,
      this.location || undefined
    ).subscribe({
      next: (result: DiagnosisResponse) => {
        // Store full result in localStorage for offline/fast access
        localStorage.setItem('last_diagnosis', JSON.stringify(result));
        this.analyzing = false;
        this.router.navigate(['/result', result.id]);
      },
      error: (err: any) => {
        this.analyzing = false;
        this.errorMsg = err?.error?.message || 'Analysis failed. Please try again.';
      }
    });
  }

  private clearPreview(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    this.selectedFile = null;
  }

  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }
}
