'use client';

import { StatusIndicator as SharedStatusIndicator } from '@/components/common';

export function StatusIndicator() {
  const handleRefresh = async () => {
    // Dashboard specific refresh logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Refresh dashboard data here
  };

  return (
    <SharedStatusIndicator 
      connectionStatus="online"
      systemStatus="normal"
      systemStatusText="Sistem Normal"
      onRefresh={handleRefresh}
      showLastUpdate={true}
      className="mb-4"
    />
  );
}