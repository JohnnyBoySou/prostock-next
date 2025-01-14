"use client"

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { showReportProduct } from '@/app/api/report'

export default function ProductReportPage() {
  const params = useParams()
  const productId = params.productId
  const storeId = params.id

  const { data, isLoading } = useQuery({
    queryKey: ["product report", productId, storeId],
    queryFn: () => showReportProduct(productId, storeId)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Store item={data} />
      <Charts data={data} />
    </div>
  )
}

const Store = ({ item }) => {
  const { nome, status, descricao, estoque_maximo, estoque_minimo, unidade } = item

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{nome}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{descricao} - {status} - {unidade}</p>
        <p className="text-gray-600">Máx: {estoque_maximo} - Mín: {estoque_minimo}</p>
      </CardContent>
    </Card>
  )
}

const Charts = ({ data }) => {
  const meses = data?.estatisticas

  const chartData = meses.map((mes, index) => ({
    name: mes.mes.slice(0, 3),
    ocupacao: mes.estoque_ocupado,
    entrada: mes.entrada,
    saida: mes.saida
  }))

  return (
    <div className="space-y-6">
      <ChartCard
        title="Ocupação"
        data={chartData}
        dataKey="ocupacao"
        color="#FF1828"
        maxValue={meses[0].estoque_maximo}
      />
      <ChartCard
        title="Entrada"
        data={chartData}
        dataKey="entrada"
        color="#FFB238"
        maxValue={Math.max(...chartData.map(item => item.entrada))}
      />
      <ChartCard
        title="Saída"
        data={chartData}
        dataKey="saida"
        color="#3590F3"
        maxValue={Math.max(...chartData.map(item => item.saida))}
      />
    </div>
  )
}

const ChartCard = ({ title, data, dataKey, color, maxValue }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, maxValue]} />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} maxBarSize={52} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

