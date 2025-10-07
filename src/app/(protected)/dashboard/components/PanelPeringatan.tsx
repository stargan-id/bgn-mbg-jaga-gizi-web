'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Clock, CheckCircle, Eye } from 'lucide-react';
import { AlertData } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface PanelPeringatanProps {
  alerts: AlertData[];
}

export function PanelPeringatan({ alerts }: PanelPeringatanProps) {
  const getSeverityColor = (severity: AlertData['severity']) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: AlertData['type']) => {
    switch (type) {
      case 'NO_REPORT':
        return <Clock className="w-4 h-4" />;
      case 'LOW_COMPLIANCE':
        return <AlertCircle className="w-4 h-4" />;
      case 'FOOD_SAFETY':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'SYSTEM':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: AlertData['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'ACKNOWLEDGED':
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case 'RESOLVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'ACTIVE');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'ACKNOWLEDGED');

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Peringatan Sistem</CardTitle>
          <div className="flex gap-2">
            <Badge variant="destructive" className="text-xs">
              {activeAlerts.length} Aktif
            </Badge>
            {acknowledgedAlerts.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {acknowledgedAlerts.length} Diketahui
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada peringatan aktif</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'HIGH' 
                    ? 'border-l-red-500 bg-red-50' 
                    : alert.severity === 'MEDIUM'
                    ? 'border-l-yellow-500 bg-yellow-50'
                    : 'border-l-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-1 rounded-full ${
                      alert.severity === 'HIGH' 
                        ? 'bg-red-100' 
                        : alert.severity === 'MEDIUM'
                        ? 'bg-yellow-100'
                        : 'bg-blue-100'
                    }`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getSeverityColor(alert.severity)}`}
                        >
                          {alert.severity}
                        </Badge>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(alert.status)}
                          <span className="text-xs text-gray-500 capitalize">
                            {alert.status.toLowerCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {alert.message}
                      </p>
                      {alert.sppgName && (
                        <p className="text-xs text-gray-600 mb-1">
                          {alert.sppgName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(alert.timestamp), { 
                          addSuffix: true,
                          locale: id 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {alert.status === 'ACTIVE' && (
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Tandai Diketahui
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Lihat Detail
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {alerts.length > 0 && (
          <div className="pt-3 border-t">
            <Button variant="outline" className="w-full text-sm">
              Lihat Semua Peringatan
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}