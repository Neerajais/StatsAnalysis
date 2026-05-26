'use client';

import { useRef, useState } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { parseCSVData, validateCSVStructure, DashboardData } from '@/lib/calculations';

interface CSVUploaderProps {
  onDataUpload: (data: DashboardData[]) => void;
  isLoading?: boolean;
}

export default function CSVUploader({ onDataUpload, isLoading = false }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);
    setUploading(true);

    try {
      // Validate file type
      if (!file.name.toLowerCase().endsWith('.csv')) {
        throw new Error('Please upload a CSV file (.csv)');
      }

      // Read file
      const text = await file.text();
      if (!text.trim()) {
        throw new Error('CSV file is empty');
      }

      // Parse CSV
      const data = await parseCSVData(text);

      // Validate structure
      const validation = validateCSVStructure(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      // Success
      setFileName(file.name);
      setSuccess(true);
      onDataUpload(data);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Clear success message after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setFileName(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Create a synthetic change event with the dropped file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative border-2 border-dashed border-border rounded-lg p-6 bg-secondary/50 hover:bg-secondary/70 transition-colors cursor-pointer group"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            disabled={uploading || isLoading}
            className="hidden"
          />

          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="p-2 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <Upload className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
            </div>
            <p className="font-semibold text-foreground">
              {uploading || isLoading ? 'Processing file...' : 'Click to upload or drag and drop'}
            </p>
          </div>

          {/* Loading indicator */}
          {(uploading || isLoading) && (
            <div className="absolute inset-0 bg-background/50 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <Loader className="w-6 h-6 text-primary animate-spin" />
            </div>
          )}
        </div>

        {/* File info and messages */}
        <div className="flex items-center justify-between">
          {fileName && (
            <span className="text-sm text-muted-foreground">
              Uploaded: <span className="font-medium text-foreground">{fileName}</span>
            </span>
          )}

          {/* Success message */}
          {success && (
            <div className="flex items-center gap-2 text-green-600 text-sm animate-in fade-in">
              <CheckCircle className="w-4 h-4" />
              CSV loaded successfully
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm animate-in fade-in">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
