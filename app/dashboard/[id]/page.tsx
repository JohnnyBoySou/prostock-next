"use client"

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { showReportStore, showReportProduct } from '@/hooks/report'

export default function Dashboard() {
  const params = useParams()
  const storeId = params.id as string
  const [storeData, setStoreData] = useState<any>(null)
  const [productData, setProductData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeReport = await showReportStore(parseInt(storeId))
        setStoreData(storeReport)

        // Assuming we want to show the report for the first product
        if (storeReport.produtos && storeReport.produtos.length > 0) {
          const productReport = await showReportProduct(storeReport.produtos[0].id, parseInt(storeId))
          setProductData(productReport)
        }

        setLoading(false)
      } catch (err) {
        setError('Failed to fetch report data')
        setLoading(false)
      }
    }

    fetchData()
  }, [storeId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!storeData) return <div>No data available</div>

  const chartData = [
    { name: 'Input', value: storeData.input },
    { name: 'Output', value: storeData.output },
    { name: 'Maximum Stock', value: storeData.maximum_stock },
    { name: 'Occupied Stock', value: storeData.occupied_stock },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard for {storeData.nome}</h1>
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
      {productData && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Product Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Product ID:</strong> {productData.produto_id}</p>
            <p><strong>Type:</strong> {productData.tipo}</p>
            <p><strong>Quantity:</strong> {productData.quantidade}</p>
            <p><strong>Price:</strong> {productData.preco}</p>
            <p><strong>Supplier ID:</strong> {productData.fornecedor_id}</p>
            <p><strong>Batch:</strong> {productData.lote}</p>
            <p><strong>Validity:</strong> {productData.validade}</p>
            <p><strong>Observations:</strong> {productData.observacoes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

