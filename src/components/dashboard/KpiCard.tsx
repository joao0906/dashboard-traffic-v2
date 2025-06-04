import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  previousValue?: number
  formatAsCurrency?: boolean
  currencySymbol?: string
  unit?: string
  isLoading?: boolean
  icon?: React.ReactNode
}

export default function KpiCard({
  title,
  value,
  previousValue,
  formatAsCurrency = false,
  currencySymbol = 'R$',
  unit,
  isLoading = false,
  icon
}: KpiCardProps) {
  // Calcular tendência
  const calculateTrend = () => {
    if (!previousValue || typeof value !== 'number') return null
    
    const trendPercentage = ((value - previousValue) / previousValue) * 100
    return {
      percentage: Math.abs(trendPercentage).toFixed(1),
      isPositive: trendPercentage > 0,
      isNeutral: trendPercentage === 0
    }
  }

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val
    
    if (formatAsCurrency) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        currencyDisplay: 'symbol'
      }).format(val).replace('R$', currencySymbol)
    }
    
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(val)
    
    return unit ? `${formatted}${unit}` : formatted
  }

  const trend = calculateTrend()

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
          </div>
          {icon && (
            <div className="ml-4 opacity-50">
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
          
          {trend && (
            <div className="mt-2 flex items-center">
              {trend.isNeutral ? (
                <Minus className="h-3 w-3 text-gray-400" />
              ) : trend.isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={`ml-1 text-xs font-medium ${
                trend.isNeutral
                  ? 'text-gray-500'
                  : trend.isPositive
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                {trend.isNeutral ? '0%' : `${trend.percentage}%`}
                <span className="text-gray-500 ml-1">vs período anterior</span>
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="ml-4 flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
} 