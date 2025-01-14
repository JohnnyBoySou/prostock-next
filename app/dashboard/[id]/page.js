"use client"

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, LayoutGrid, Truck, Users } from 'lucide-react'
import { showReportStore } from '@/app/api/report'
import { listProductStore } from '@/app/api/product'
import Link from 'next/link'
import colors from '@/app/colors'

export default function DashboardPage() {
  const params = useParams()
  const id = params.id 

  const { data, isLoading } = useQuery({
    queryKey: ["stores report single", id],
    queryFn: () => showReportStore(id)
  })

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["product list store", id],
    queryFn: () => listProductStore(id)
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Carregando...</span>
      </div>
    )
  }

  return (
      <div className="container mx-auto p-4 space-y-6">
        <Store item={data} />
        <Charts data={data} />
        <Items data={products?.data} storeId={id} />
      </div>
  )
}

const Store = ({ item }) => {
  const { nome, status, cidade, estado, cnpj, funcionarios, produtos, fornecedores } = item

  return (
    <Card>
      <CardHeader>
        <CardTitle>{nome}</CardTitle>
        <p className="text-sm text-gray-500">{cidade}, {estado} - {status}</p>
        <p className="text-sm text-gray-500">CNPJ: {cnpj}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <StoreInfoCard title="Funcionários" value={funcionarios} color="#43AA8B" icon={<Users color='#43AA8B'/>} />
          <StoreInfoCard title="Produtos" value={produtos} color="#3590F3" icon={<LayoutGrid color='#3590F3'/>} />
          <StoreInfoCard title="Fornecedores" value={fornecedores} color="#9747FF" icon={<Truck color='#9747FF'/>} />
        </div>
      </CardContent>
    </Card>
  )
}

const StoreInfoCard = ({ title, value, color, icon }) => (
  <div className="p-4 rounded-lg" style={{ backgroundColor: `${color}20` }}>
    <p className="text-sm" style={{ color }}>{title}</p>
    <div className="flex justify-between items-center mt-2">
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      {icon}
    </div>
  </div>
)

const Charts = ({ data }) => {
  const meses = data.meses

  const chartData = [
    { name: meses[0].mes.slice(0, 3), ocupacao: meses[0].estoque_ocupado, entrada: meses[0].entrada, saida: meses[0].saida },
    { name: meses[1].mes.slice(0, 3), ocupacao: meses[1].estoque_ocupado, entrada: meses[1].entrada, saida: meses[1].saida },
    { name: meses[2].mes.slice(0, 3), ocupacao: meses[2].estoque_ocupado, entrada: meses[2].entrada, saida: meses[2].saida },
  ]

  return (
    <div className="space-y-2">
      <ChartCard title="Ocupação" data={chartData} dataKey="ocupacao" color="#FF1828" maxValue={meses[0].estoque_maximo} />
      <ChartCard title="Entrada" data={chartData} dataKey="entrada" color="#FFB238" />
      <ChartCard title="Saída" data={chartData} dataKey="saida" color="#3590F3" />
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
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill={color} maxBarSize={52} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
)

const Items = ({ data, storeId  }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8">Nenhum produto encontrado.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>
      <div className="space-y-4">
        {data.map((item) => (
            <ProductCard key={item.id} item={item} storeId={storeId} />
        ))}
      </div>
    </div>
  )
}

const ProductCard = ({ item, storeId }) => {
  const { id, nome, status, unidade, estoque_maximo, estoque_minimo } = item
  return (
    <Link href={`/dashboard/${storeId}/product/${id}`}>
      <Card className='border my-4'>
        <CardContent className="flex justify-between items-center p-4">
          <div>
            <h3 className="text-lg font-semibold">{nome} ({unidade})</h3>
            <p className="text-sm text-gray-500">{status} • Mín {estoque_minimo} • Máx {estoque_maximo}</p>
          </div>
           <ChevronRight size={32} color={colors.color.primary} />
        </CardContent>
      </Card>
    </Link>
  )
}


