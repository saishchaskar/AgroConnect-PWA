import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-diagnosis-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="form-card">
      <div class="form-header">
        <h3>Crop disease diagnosis</h3>
        <span class="status-pill">Ready</span>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>
          Crop type
          <select formControlName="cropType">
            <option value="">Select crop</option>
            <option value="rice">Rice</option>
            <option value="wheat">Wheat</option>
            <option value="tomato">Tomato</option>
            <option value="potato">Potato</option>
            <option value="cotton">Cotton</option>
          </select>
        </label>

        <label>
          Location
          <input type="text" formControlName="location" placeholder="e.g. Maharashtra" />
        </label>

        <label>
          Notes
          <textarea formControlName="notes" rows="4" placeholder="Describe symptoms or visible leaf damage"></textarea>
        </label>

        <label class="upload-box">
          <span>Upload crop image</span>
          <input type="file" accept="image/*" />
        </label>

        <button type="submit" class="primary-btn" [disabled]="form.invalid">Analyze crop</button>
      </form>
    </section>
  `,
  styles: [
    `
      .form-card {
        background: rgba(255,255,255,0.85);
        border: 1px solid #dfe9df;
        border-radius: 22px;
        padding: 20px;
        box-shadow: 0 16px 32px rgba(27, 64, 35, 0.04);
      }

      .form-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      h3 {
        margin: 0;
      }

      .status-pill {
        display: inline-flex;
        border-radius: 999px;
        background: #eaf7ec;
        color: #1d5b3a;
        font-size: 12px;
        font-weight: 700;
        padding: 6px 10px;
      }

      form {
        display: grid;
        gap: 16px;
      }

      label {
        display: grid;
        gap: 8px;
        color: #325241;
        font-weight: 600;
      }

      input,
      select,
      textarea {
        border: 1px solid #dfe7df;
        background: #fff;
        border-radius: 12px;
        padding: 0.8rem 0.9rem;
        font: inherit;
      }

      .upload-box {
        border: 1px dashed #bfd5c3;
        border-radius: 12px;
        background: #f8fbf8;
        padding: 16px;
      }

      .primary-btn {
        border: none;
        border-radius: 12px;
        background: linear-gradient(135deg, #1f7a45, #4eaa69);
        color: white;
        padding: 0.85rem 1.1rem;
        font-weight: 700;
        cursor: pointer;
      }
    `
  ]
})
export class DiagnosisFormComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cropType: ['', Validators.required],
      location: ['', Validators.required],
      notes: ['', [Validators.minLength(8)]],
      image: [null]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Diagnosis request payload:', this.form.value);
    }
  }
}
