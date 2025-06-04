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
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-2xl animate-pulse w-24"></div>
          <div className="h-8 bg-gray-200 rounded-2xl animate-pulse w-32"></div>
          <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-20"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 
                    hover:shadow-md hover:border-gray-200 
                    transition-all duration-200 group">
      
      {/* Header com ícone */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </div>
        {icon && (
          <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center 
                         group-hover:bg-violet-100 transition-colors">
            <div className="text-violet-600">
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {/* Valor Principal */}
      <div className="mb-4">
        <p className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
          {formatValue(value)}
        </p>
      </div>
      
      {/* Tendência */}
      {trend && (
        <div className={`inline-flex items-center px-3 py-1 rounded-2xl text-sm font-medium ${
          trend.isNeutral
            ? 'bg-gray-100 text-gray-600'
            : trend.isPositive
            ? 'bg-green-50 text-green-600'
            : 'bg-red-50 text-red-600'
        }`}>
          {trend.isNeutral ? (
            <Minus className="h-3 w-3 mr-1.5" />
          ) : trend.isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1.5" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1.5" />
          )}
          <span>
            {trend.isNeutral ? '0%' : `${trend.isPositive ? '+' : '-'}${trend.percentage}%`}
          </span>
        </div>
      )}
      
      {!trend && (
        <div className="text-xs text-gray-400">
          Últimos 30 dias
        </div>
      )}
    </div>
  )
} 