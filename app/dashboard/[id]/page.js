"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer , Cell} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, ChevronRight, LayoutGrid, Truck, Users } from 'lucide-react'
import { showReportStore } from '@/app/api/report'
import { listReportProduct } from '@/app/api/report'
import Link from 'next/link'
import colors from '@/app/colors'
import { Button } from '@/components/ui/button';


import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { listSupplierStore } from '@/app/api/supplier'

export default function DashboardPage() {
  const params = useParams()
  const id = params.id
  const dateNow = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

  const [dateC, setdateC] = useState('2025-01-01');
  const [dateF, setdateF] = useState(dateNow);

  const [fornecedor, setfornecedor] = useState();
  const [produto, setproduto] = useState();

  const { data, isLoading, refetch: refetchStore } = useQuery({
    queryKey: ["stores report single", id],
    queryFn: () => showReportStore(id, fornecedor, produto)
  })

  const { data: products, isLoading: loadingProducts, refetch: refetchProduct } = useQuery({
    queryKey: ["product list store", id],
    queryFn: () => listReportProduct(id, 1, dateC, dateF)
  })
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery({
    queryKey: ["supplier list store", id],
    queryFn: () => listSupplierStore(id, 1,) 
  })


  const handleSearch = () => {
    refetchStore();
    refetchProduct()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Carregando...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Store item={data} suppliers={suppliers} setdateC={setdateC} setdateF={setdateF} handleSearch={handleSearch} dateC={dateC} dateF={dateF} setfornecedor={setfornecedor} fornecedor={fornecedor}/>
      <Charts data={data} />
      <Items data={products?.data} storeId={id} />
    </div>
  )
}

const Store = ({ item, fornecedor, suppliers, setfornecedor, setdateC, setdateF, dateC, dateF, handleSearch }) => {
  const { nome, status, cidade, estado, cnpj, funcionarios, produtos, fornecedores } = item
  const CardSupplier = ({ item }) => {
    if (!item) return null;
    const { id, status, cidade, id_loja, nome_fantasia, } = item;
    return (
      <div onClick={() => { setfornecedor(fornecedor === id ? '' : id) }} style={{ marginBottom: 10, }}>
        <div pv={20} className='flex-row flex justify-between items-center'  style={{ backgroundColor: '#FFF', padding: 12,  borderRadius: 8, borderWidth: 2, borderColor: fornecedor == id ? colors.color.green : '#D1D1D1' }}>
          <div gv={6} className='flex-col flex'>
            <span size={20} fontFamily='Font_Medium'>{nome_fantasia?.length > 32 ? nome_fantasia?.slice(0, 32) + '...' : nome_fantasia}</span>
            <span style={{ opacity: .6, }}>{cidade} • {status} </span>
          </div>
          <Check color={fornecedor == id ? colors.color.primary : '#fff'} />
        </div>
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{nome}</CardTitle>
        <p className="text-sm text-gray-500">{cidade}, {estado} - {status}</p>
        <p className="text-sm text-gray-500">CNPJ: {cnpj}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <StoreInfoCard title="Funcionários" value={funcionarios} color="#43AA8B" icon={<Users color='#43AA8B' />} />
          <StoreInfoCard title="Produtos" value={produtos} color="#3590F3" icon={<LayoutGrid color='#3590F3' />} />
          <StoreInfoCard title="Fornecedores" value={fornecedores} color="#9747FF" icon={<Truck color='#9747FF' />} />
        </div>
        <Drawer>
          <DrawerTrigger style={{ alignItems: 'center', alignSelf: 'center', height: 56, borderRadius: 8, backgroundColor: colors.color.primary, justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 20, }}>
            <span style={{ fontSize: 18, color: '#fff' }}>Ver filtros</span>
          </DrawerTrigger>
          <DrawerContent className='py-6 px-12' >
            <span style={{ fontSize: 32, fontWeight: 500, }}>Filtrar por data</span>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
              <div>
                <label htmlFor="dateC" style={{ display: 'block', marginBottom: 8 }}>Data de início:</label>
                <input
                  type="date"
                  id="dateC"
                  value={dateC}
                  defaultValue={dateC}
                  onChange={(e) => setdateC(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </div>
              <div>
                <label htmlFor="dateF" style={{ display: 'block', marginBottom: 8 }}>Data de fim:</label>
                <input
                  type="date"
                  id="dateF"
                  value={dateF}
                  defaultValue={dateC}
                  onChange={(e) => setdateF(e.target.value)}
                  style={{
                    padding: 8,
                    borderRadius: 4,
                    border: '1px solid #ccc',
                    width: '100%',
                  }}
                />
              </div>
            </div>
            <span style={{ fontSize: 32, fontWeight: 500, marginTop: 20, }}>Filtrar por fornecedor</span>
            <ScrollArea style={{ maxHeight: 200, marginTop: 16, }}>
              {suppliers?.map((item) => (
                <CardSupplier key={item.id} item={item} />
              ))}
            </ScrollArea>

              <DrawerClose>
                <Button onClick={handleSearch} style={{ backgroundColor: colors.color.primary, width: '100%', marginTop: 20,  fontSize: 18, height: 52,  }}>Definir filtros</Button>
              </DrawerClose>
          </DrawerContent>
        </Drawer>
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
    { name: meses[0].mes.slice(0, 3), ocupacao: meses[0].estoque_ocupado, entrada: meses[0].entrada, saida: meses[0].saida, perdas: meses[0].perdas },
    { name: meses[1].mes.slice(0, 3), ocupacao: meses[1].estoque_ocupado, entrada: meses[1].entrada, saida: meses[1].saida, perdas: meses[1].perdas },
    { name: meses[2].mes.slice(0, 3), ocupacao: meses[2].estoque_ocupado, entrada: meses[2].entrada, saida: meses[2].saida, perdas: meses[2].perdas },
  ]

  return (
    <div className="space-y-2">
      <ChartCard title="Ocupação" data={chartData} dataKey="ocupacao" color="#FF1828" maxValue={meses[0].estoque_maximo} />
      <ChartCard title="Entrada" data={chartData} dataKey="entrada" color="#019866" />
      <ChartCard title="Saída" data={chartData} dataKey="saida" color="#3590F3" />
      <ChartCard title="Perdas" data={chartData} dataKey="perdas" color="#FFB238" />
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

const Items = ({ data, storeId }) => {
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
  const { nome, status, unidade, id,

    estoque_ocupado, entrada, saida, perdas,

    estoque_maximo, estoque_minimo, } = item;
  const data = [
    { value: parseInt(estoque_ocupado), label: 'Ocupação', key: 'ocupacao', frontColor: '#FF1828' },
    { value: parseInt(entrada), label: 'Entrada', key: 'entrada', frontColor: '#019866' },
    { value: parseInt(saida), label: 'Saida', key: 'saida', frontColor: '#3590F3' },
    { value: parseInt(perdas), label: 'Perdas', key: 'perdas', frontColor: '#FFB238' }
  ];

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
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="value"
              maxBarSize={52}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.frontColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </Card>
    </Link>
  )
}


