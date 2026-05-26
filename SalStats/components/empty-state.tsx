'use client';

import { Upload } from 'lucide-react';
import CSVUploader from './csv-uploader';
import { DashboardData } from '@/lib/calculations';

interface EmptyStateProps {
  onDataUpload: (data: DashboardData[]) => void;
}

export default function EmptyState({ onDataUpload }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl w-full mx-auto px-6">
        <div className="bg-card rounded-2xl shadow-2xl p-12 border border-border/30">
          {/* Icon with glow */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative bg-primary/10 p-5 rounded-full border border-primary/20">
                <Upload className="w-10 h-10 text-primary" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Title with solid color */}
          <h1 className="text-4xl font-bold text-primary mb-4 text-center">
            SAL Analysis
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-12 text-center leading-relaxed">
            Strategic Analytics & Insights platform for powerful data visualization and analysis
          </p>

          {/* CSV Uploader Component */}
          <div className="mb-8">
            <CSVUploader onDataUpload={onDataUpload} />
          </div>

          {/* Features list */}
          <div className="grid grid-cols-3 gap-4 mb-8 pt-8 border-t border-border/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Instant</p>
              <p className="text-xs text-foreground/60">Processing</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Real-time</p>
              <p className="text-xs text-foreground/60">Analytics</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Beautiful</p>
              <p className="text-xs text-foreground/60">Visualizations</p>
            </div>
          </div>

          {/* Help text */}
          <p className="text-xs text-muted-foreground text-center">
            Supports CSV files • Automatic processing • Real-time analytics
          </p>
        </div>
      </div>
    </div>
  );
}
