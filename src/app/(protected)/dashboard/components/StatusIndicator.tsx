'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wifi, 
  WifiOff, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useState, useEffect } from 'react';

export function StatusIndicator() {
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {connectionStatus === 'online' ? (
                <Wifi className="w-4 h-4 text-green-600" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-600" />
              )}
              <Badge 
                variant={connectionStatus === 'online' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {connectionStatus === 'online' ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                Sistem Normal
              </Badge>
            </div>

            {/* Last Update */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Update: {lastUpdate.toLocaleTimeString('id-ID')}</span>
            </div>
          </div>

          {/* Refresh Button */}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:block">Refresh</span>
          </Button>
        </div>

        {/* Mobile Last Update */}
        <div className="md:hidden mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Terakhir update: {lastUpdate.toLocaleTimeString('id-ID')}</span>
        </div>
      </CardContent>
    </Card>
  );
}