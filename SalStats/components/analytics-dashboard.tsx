'use client';

import { useState, useMemo } from 'react';
import { DashboardData, filterDataByOwners } from '@/lib/calculations';
import CSVUploader from './csv-uploader';
import OwnerSlicer from './owner-slicer';
import EmptyState from './empty-state';
import ESChart from './charts/es-chart';
import StatusChart from './charts/status-chart';
import VirtualizedDataTable from './virtualized-data-table';
import { Menu, X, Upload } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [csvData, setCSVData] = useState<DashboardData[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter data based on selected owners
  const filteredData = useMemo(() => {
    return filterDataByOwners(csvData, selectedOwners.size > 0 ? selectedOwners : null);
  }, [csvData, selectedOwners]);

  // Handle CSV upload
  const handleDataUpload = (data: DashboardData[]) => {
    setCSVData(data);
    setSelectedOwners(new Set()); // Reset filters when new data uploaded
    setShowUploadModal(false); // Close modal after upload
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // If no data, show empty state
  if (csvData.length === 0) {
    return <EmptyState onDataUpload={handleDataUpload} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar - Premium Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/30 shadow-lg sticky top-0 z-40">
        <div className="max-w-full px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                SAL Analysis
              </h1>
              <p className="text-xs text-muted-foreground mt-1">Strategic Analytics & Insights</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Upload CSV Button with hover effect */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 text-primary-foreground rounded-xl transition-all duration-200 font-semibold text-sm"
              >
                <Upload className="w-4 h-4" />
                Upload CSV
              </button>
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-full">
        {/* Sidebar - Filters */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block lg:w-64 flex-shrink-0 bg-card border-r border-border p-6 sticky top-24 h-fit max-h-[calc(100vh-6rem)] overflow-y-auto`}
        >
          <OwnerSlicer
            data={csvData}
            selectedOwners={selectedOwners}
            onOwnerSelect={setSelectedOwners}
          />
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 px-4 lg:px-6 py-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* ES Chart */}
            <div>
              <ESChart data={filteredData} />
            </div>

            {/* Status Chart */}
            <div>
              <StatusChart data={filteredData} />
            </div>
          </div>

          {/* Data Table */}
          <div className="mb-6">
            <VirtualizedDataTable data={filteredData} />
          </div>

          {/* Summary Info */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                <p className="text-2xl font-bold text-primary">{filteredData.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Uploaded</p>
                <p className="text-2xl font-bold text-primary">{csvData.length}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Active Filters</p>
                <p className="text-2xl font-bold text-accent">{selectedOwners.size}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Filter Ratio</p>
                <p className="text-2xl font-bold text-primary">
                  {filteredData.length === 0
                    ? '0%'
                    : Math.round((filteredData.length / csvData.length) * 100) + '%'}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Upload New CSV File</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-4">
                Replace your current data with a new CSV file. The new data will reset all filters.
              </p>
            </div>
            <CSVUploader onDataUpload={handleDataUpload} />
          </div>
        </div>
      )}
    </div>
  );
}
