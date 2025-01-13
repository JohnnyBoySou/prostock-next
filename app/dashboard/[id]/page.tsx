"use client"

import { useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storeStats } from '@/lib/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const params = useParams()
  const storeId = params.id as string
  const storeData = storeStats.find(store => store.id === storeId)

  if (!storeData) {
    return <div>Store not found</div>
  }

  const chartData = [
    { name: 'Input', value: storeData.input },
    { name: 'Output', value: storeData.output },
    { name: 'Maximum Stock', value: storeData.maximum_stock },
    { name: 'Occupied Stock', value: storeData.occupied_stock },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard for {storeData.store_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Store Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> {storeData.status}</p>
            <p><strong>Input/Output Percentage:</strong> {storeData.input_output_percentage}%</p>
            <p><strong>Stock Percentage:</strong> {storeData.percentage_stock}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Store Metrics</CardTitle>
            <CardDescription>Comparing input, output, and stock levels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

