import React from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps
} from 'recharts'

interface RoasData {
  date: string
  roas: number | null
}

interface RoasTrendChartProps {
  data: RoasData[]
  isLoading?: boolean
  aspectRatio?: number
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{
    value: number
    payload: RoasData
  }>
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
    
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {formattedDate}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ROAS: <span className="font-semibold text-blue-600">
            {data.roas ? `${data.roas.toFixed(2)}x` : 'N/A'}
          </span>
        </p>
      </div>
    )
  }

  return null
}

export default function RoasTrendChart({
  data,
  isLoading = false,
  aspectRatio = 16/9
}: RoasTrendChartProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <div className="mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
        </div>
        <div 
          className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
          style={{ aspectRatio }}
        ></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tendência ROAS
        </h3>
        <div 
          className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
          style={{ aspectRatio }}
        >
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Sem dados de ROAS disponíveis
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Os dados aparecerão aqui quando as campanhas começarem a gerar métricas
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Preparar dados para o gráfico
  const chartData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }))

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Tendência ROAS
      </h3>
      
      <ResponsiveContainer width="100%" aspect={aspectRatio}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb"
            className="dark:stroke-gray-600"
          />
          <XAxis
            dataKey="formattedDate"
            tick={{ 
              fontSize: 12,
              fill: '#6b7280'
            }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis
            domain={[0, 'auto']}
            tick={{ 
              fontSize: 12,
              fill: '#6b7280'
            }}
            tickLine={{ stroke: '#d1d5db' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `${value.toFixed(1)}x`}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="roas"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ 
              r: 4, 
              fill: '#3b82f6',
              strokeWidth: 2,
              stroke: '#ffffff'
            }}
            activeDot={{ 
              r: 6, 
              fill: '#2563eb',
              strokeWidth: 2,
              stroke: '#ffffff'
            }}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 