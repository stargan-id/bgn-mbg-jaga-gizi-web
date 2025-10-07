'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { ActivityFeed } from '@/types/dashboard';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

interface FeedAktivitasProps {
  activities: ActivityFeed[];
}

export function FeedAktivitas({ activities }: FeedAktivitasProps) {
  const getActivityIcon = (type: ActivityFeed['type']) => {
    switch (type) {
      case 'REPORT_SUBMITTED':
        return <FileText className="w-4 h-4" />;
      case 'ISSUE_RESOLVED':
        return <CheckCircle className="w-4 h-4" />;
      case 'VERIFICATION':
        return <CheckCircle className="w-4 h-4" />;
      case 'ALERT':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ActivityFeed['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getIconColor = (status: ActivityFeed['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      case 'info':
        return 'text-blue-600 bg-blue-50';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Feed Aktivitas
            </div>
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <div key={activity.id} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${getIconColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-px h-8 bg-gray-200 mt-2" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(activity.status)}`}
                    >
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(activity.timestamp), { 
                        addSuffix: true,
                        locale: id 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    {activity.message}
                  </p>
                  
                  <p className="text-xs text-gray-600">
                    {activity.sppgName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activities.length > 5 && (
          <div className="pt-4 border-t mt-4">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
              Lihat semua aktivitas →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}