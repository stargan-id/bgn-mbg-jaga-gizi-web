'use client';

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: string;
  color: 'blue' | 'red' | 'orange' | 'yellow' | 'green' | 'gray';
}

const colorVariants = {
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600'
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    iconText: 'text-red-600'
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-600'
  },
  green: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600'
  },
  gray: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-600'
  }
};

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  const variant = colorVariants[color];

  return (
    <Card className={cn("transition-all hover:shadow-md", variant.bg, variant.border)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <p className={cn("text-3xl font-bold", variant.text)}>
              {value.toLocaleString('id-ID')}
            </p>
            {trend && (
              <p className="text-xs text-muted-foreground">
                {trend}
              </p>
            )}
          </div>
          <div className={cn(
            "p-3 rounded-full",
            variant.iconBg
          )}>
            <Icon className={cn("w-6 h-6", variant.iconText)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}