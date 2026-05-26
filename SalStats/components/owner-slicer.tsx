'use client';

import { useMemo } from 'react';
import { DashboardData } from '@/lib/calculations';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface OwnerSlicerProps {
  data: DashboardData[];
  selectedOwners: Set<string>;
  onOwnerSelect: (owners: Set<string>) => void;
}

export default function OwnerSlicer({
  data,
  selectedOwners,
  onOwnerSelect,
}: OwnerSlicerProps) {
  // Get unique owners dynamically from data
  const owners = useMemo(() => {
    const ownerSet = new Set<string>();
    data.forEach(row => {
      if (row.Owner?.trim()) {
        ownerSet.add(row.Owner.trim());
      }
    });
    return Array.from(ownerSet).sort();
  }, [data]);

  const handleOwnerToggle = (owner: string) => {
    const newSelected = new Set(selectedOwners);
    if (newSelected.has(owner)) {
      newSelected.delete(owner);
    } else {
      newSelected.add(owner);
    }
    onOwnerSelect(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOwners.size === owners.length) {
      // Deselect all
      onOwnerSelect(new Set());
    } else {
      // Select all
      onOwnerSelect(new Set(owners));
    }
  };

  const handleClearAll = () => {
    onOwnerSelect(new Set());
  };

  const isAllSelected = owners.length > 0 && selectedOwners.size === owners.length;
  const isPartialSelected = selectedOwners.size > 0 && selectedOwners.size < owners.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Owner</h3>
        <div className="text-xs text-muted-foreground">
          {selectedOwners.size > 0 ? `${selectedOwners.size}/${owners.length}` : 'All'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSelectAll}
          className={`text-xs font-medium px-3 py-1.5 rounded transition-all ${
            isAllSelected
              ? 'bg-primary text-primary-foreground'
              : isPartialSelected
                ? 'bg-primary/50 text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
          }`}
        >
          Select All
        </button>
        {selectedOwners.size > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-medium px-3 py-1.5 rounded bg-secondary text-foreground hover:bg-secondary/80 transition-all flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Owner Buttons */}
      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
        {owners.map(owner => (
          <button
            key={owner}
            onClick={() => handleOwnerToggle(owner)}
            className={`px-3 py-2 rounded text-sm font-semibold transition-all text-left border-2 ${
              selectedOwners.has(owner)
                ? 'bg-primary text-white border-primary shadow-md'
                : 'bg-muted text-foreground border-transparent hover:bg-muted/80'
            }`}
          >
            {owner}
          </button>
        ))}
      </div>

      {/* Info text */}
      {owners.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No data available
        </p>
      )}

      {selectedOwners.size > 0 && (
        <div className="text-xs text-muted-foreground bg-secondary/50 rounded p-2">
          <p>
            Showing data for{' '}
            <span className="font-medium text-foreground">{selectedOwners.size}</span>{' '}
            {selectedOwners.size === 1 ? 'owner' : 'owners'}
          </p>
        </div>
      )}
    </div>
  );
}
