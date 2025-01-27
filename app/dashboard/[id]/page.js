"use client"
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import { Check, ChevronRight, LayoutGrid, Search, Truck, Users } from 'lucide-react'
import { showReportStore, showReportProductLine,  } from '@/app/api/report'
import colors from '@/app/colors'
import { Button } from '@/components/ui/button';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { listSupplierStoreSearch } from '@/app/api/supplier'
import { listProductStoreSearch } from '@/app/api/product'

export default function DashboardPage() {
  const params = useParams()
  const id = params.id
  const dateNow = new Date().toISOString().split('T')[0]; 

  const [dateC, setdateC] = useState('2025-01-01');
  const [dateF, setdateF] = useState(dateNow);

  const [fornecedor, setfornecedor] = useState();
  const [produto, setproduto] = useState();

  const [tab, settab] = useState('Saída');
  const types = [{ name: 'Saída', color: '#3590F3' }, { name: 'Entrada', color: '#019866' }, {name: 'Perdas', color: '#FFB238'} ];

  const { data: store, isLoading, } = useQuery({
    queryKey: ["stores report single", id],
    queryFn: () => showReportStore(id)
  })

  const { data: line, isLoading: loadingDay, refetch } = useQuery({
    queryKey: ["stores report daylist single", id, fornecedor, tab, dateC, dateF],
    queryFn: async () => {
      const res = await showReportProductLine(produto, id, fornecedor, dateC, dateF, tab);
      return res;
    },
    enabled: false
  });


  const handleSearch = () => {
    refetch();
  }

  const ultimoMes = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

  const { data: perdas, isLoading: loadingPerdas, } = useQuery({
    queryKey: ["stores perdas"],
    queryFn: async () => {
      const res = await showReportProductLine(null, id, null, ultimoMes, dateNow, 'Perdas');
      return res;
    }
  });
  const { data: entradas, isLoading: loadingEntradas, } = useQuery({
    queryKey: ["stores entradas"],
    queryFn: async () => {
      const res = await showReportProductLine(null, id, null, ultimoMes, dateNow, 'Entrada');
      return res;
    }
  });
  const { data: saidas, isLoading: loadingSaidas, } = useQuery({
    queryKey: ["stores saidas"],
    queryFn: async () => {
      const res = await showReportProductLine(null, id, null, ultimoMes, dateNow, 'Saída');
      return res;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Carregando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Store item={store} types={types} tab={tab} settab={settab} setdateC={setdateC} setdateF={setdateF} handleSearch={handleSearch} dateC={dateC} dateF={dateF}
        setfornecedor={setfornecedor} fornecedor={fornecedor}
        setproduto={setproduto} produto={produto}
      />
      {line ? <SingleCharts tab={tab} line={line} loadingDay={loadingDay} /> :
        <PlaceChart entradas={entradas} saidas={saidas} perdas={perdas} />}
    </div>
  )
}

const PlaceChart = ({ entradas, saidas, perdas }) => {
  if (!entradas || !saidas || !perdas) return null;

  return (
    <div style={{ gap: '20px', display: 'flex', paddingBottom: 20, marginBottom: 50, flexDirection: 'column', borderWidth: 2, borderColor: '#f1f1f1', margin: '0px 26px', borderRadius: 8, }}>
      <div style={{ marginBottom: 12 }}>
        <h3 className='text-[20px] md:text-[24px] font-bold text-center' style={{ marginBottom: -20, marginTop: 20, }}>Resumo dos últimos 30 dias</h3>
      </div>
      <div  className='px-4'>
        <div style={{ marginBottom: 12 }}>
          <h3 className='text-[18px] md:text-[20px] font-semibold'>Saída de produtos</h3>
          <p className='text-[14px] md:text-[18px] opacity-60'>Últimos 30 dias</p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={saidas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: 'gray', fontSize: 12 }} />
            <YAxis tick={{ fill: 'gray', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke='#3590F3' strokeWidth={3}
              name="Valores" />
          </LineChart>
        </ResponsiveContainer>

      </div>

      <div style={{ borderRadius: 8, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 className='text-[18px] md:text-[20px] font-semibold'>Entrada de produtos</h3>
          <p  className='text-[14px] md:text-[18px] opacity-60'>Últimos 30 dias</p>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={entradas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: 'gray', fontSize: 12 }} />
            <YAxis tick={{ fill: 'gray', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke='#019866' strokeWidth={3}
              name="Valores" />
          </LineChart>
        </ResponsiveContainer>

      </div>

      <div style={{ borderRadius: 8, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 className='text-[18px] md:text-[20px] font-semibold'>Perdas de produtos</h3>
          <p className='text-[14px] md:text-[18px] opacity-60'>Últimos 30 dias</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={perdas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: 'gray', fontSize: 12 }} />
            <YAxis tick={{ fill: 'gray', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke='#FFB238' strokeWidth={3}
              name="Valores" />
          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
};

const Store = ({ item, fornecedor, tab, settab, types, setfornecedor, setproduto, produto, setdateC, setdateF, dateC, dateF, handleSearch }) => {
  if (!item) return null;
  const { nome, status, cidade, estado, cnpj, funcionarios, produtos, fornecedores, id } = item
  const CardSupplier = ({ item }) => {
    if (!item) return null;
    const { id, status, cidade, id_loja, nome_fantasia, } = item;
    return (
      <div onClick={() => { setfornecedor(fornecedor === id ? '' : id) }} style={{ marginBottom: 10, }}>
        <div className='flex-row flex justify-between items-center' style={{ backgroundColor: fornecedor == id ? colors.color.blue + 10 : '#FFF', padding: 6, borderRadius: 8, borderWidth: 2, borderColor: fornecedor == id ? colors.color.blue : '#D1D1D1' }}>
          <div className='flex-col flex'>
            <span className='md:text-[18px] text-[16px] font-semibold'>{nome_fantasia?.length > 32 ? nome_fantasia?.slice(0, 32) + '...' : nome_fantasia}</span>
            <span className='md:text-[16px] text-[12px] opacity-60 -mt-1'>{cidade} • {status} </span>
          </div>
          <div style={{ width: 32, height: 32, backgroundColor: fornecedor == id ? colors.color.blue : '#fff', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', borderRadius: 6, }}>
            <Check size={24} color='#fff' />
          </div>
        </div>
      </div>
    )
  }
  const CardProduct = ({ item }) => {
    if (!item) return null;
    const { id, status, descricao, nome, unidade } = item;
    return (
      <div onClick={() => { setproduto(produto === id ? '' : id) }} style={{ marginBottom: 10, }}>
        <div className='flex-row flex justify-between items-center' style={{ backgroundColor: produto == id ? colors.color.blue + 10 : '#FFF', padding: 6, borderRadius: 8, borderWidth: 2, borderColor: produto == id ? colors.color.blue : '#D1D1D1' }}>
          <div className='flex-col flex'>
            <span className='md:text-[18px] text-[16px] font-semibold'>{nome?.length > 32 ? nome?.slice(0, 32) + '...' : nome}</span>
            <span className='md:text-[16px] text-[12px] opacity-60 -mt-1'>{unidade} • {status} </span>
          </div>
          <div style={{ width: 32, height: 32, backgroundColor: produto == id ? colors.color.blue : '#fff', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', borderRadius: 6, }}>
            <Check size={24} color='#fff' />
          </div>
        </div>
      </div>
    )
  }
  const { data: products, isLoading: loadingProducts, refetch: searchProduct } = useQuery({
    queryKey: ["product list store", id],
    queryFn: () => listProductStoreSearch(id, productName)
  })
  const { data: suppliers, isLoading: loadingSuppliers, refetch: searchSupplier } = useQuery({
    queryKey: ["supplier list store", id],
    queryFn: () => listSupplierStoreSearch(id, fornecedorName)
  })

  const [productName, setproductName] = useState('');
  const [fornecedorName, setfornecedorName] = useState('');



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
            <span style={{ fontSize: 18, color: '#fff' }}>Gerar gráfico</span>
          </DrawerTrigger>
          <DrawerContent className='md:py-6 md:px-12 px-6 py-4 gap-y-[14px]' >
            <h2 className='md:text-[32px] text-[24px]' style={{  fontWeight: 600, textAlign: 'center',}}>Gerar gráfico</h2>
            <div className='flex flex-col md:flex-row md:justify-between'>
              <div style={{ flexDirection: 'column', display: 'flex', marginBottom: 6, }}>
                <span className='md:text-[24px] text-[20px] font-semibold'>Filtrar por tipo</span>
                <div style={{ backgroundColor: '#fff', flexDirection: 'row', display: 'flex', marginTop: 6, }}>
                  {types.map((type, index) => (
                    <div onClick={() => {
                      settab(type.name);
                    }} key={index}
                      style={{
                        justifyContent: 'center', alignItems: 'center',
                        padding: '10px 20px',
                        backgroundColor: tab === type.name ? type.color : type.color+10,
                        cursor: 'pointer',
                        borderRadius: 8,
                        margin: '0px 12px 0px 0px',
                      }}>
                      <span style={{
                        fontSize: 16,
                        color: tab === type.name ? '#fff' : type.color,
                        textTransform: 'uppercase',
                      }}>{type.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className='md:text-[24px] text-[20px] font-semibold'>Filtrar por data</span>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 16, marginTop: -8 }}>
                  <div>
                    <label htmlFor="dateC" style={{ display: 'block', marginBottom: 8, opacity: .6, }}>Data de início:</label>
                    <input
                      type="date"
                      id="dateC"
                      value={dateC}
                      defaultValue={dateC}
                      onChange={(e) => setdateC(e.target.value)}
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        border: '2px solid #ccc',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="dateF" style={{ display: 'block', marginBottom: 8, opacity: .6, }}>Data de fim:</label>
                    <input
                      type="date"
                      id="dateF"
                      value={dateF}
                      defaultValue={dateC}
                      onChange={(e) => setdateF(e.target.value)}
                      style={{
                        padding: 8,
                        borderRadius: 4,
                        border: '2px solid #ccc',
                        width: '100%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div >
              <span className='md:text-[24px] text-[20px] font-semibold'>Filtrar por fornecedor</span>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 12, marginTop: 6, marginBottom: 12, }}>
                <input
                  type="search"
                  id="fornecedorName"
                  value={fornecedorName}
                  defaultValue={fornecedorName}
                  onChange={(e) => setfornecedorName(e.target.value)}
                  placeholder='Ex: Nova Era Ltda'
                  onKeyDown={(e) => { if (e.key === 'Enter') searchSupplier() }}
                  className='md:p-4 p-2'
                  style={{
                    borderRadius: 6,
                    border: '2px solid #ccc',
                    width: '100%',
                  }}
                />
                <div onClick={searchSupplier}
                  className='md:w-[58px] md:h-[58px] w-[46px] h-[42px]'
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#20202060', borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                  <Search size={20} color='#fff' />
                </div>
              </div>
              <ScrollArea className='md:h-[160px] h-[120px]' style={{ marginTop: 16, }}>
                {suppliers?.slice(0, 10)?.map((item) => (
                  <CardSupplier key={item.id} item={item} />
                ))}
                {suppliers?.length === 0 && <div className="text-center py-8">Nenhum fornecedor encontrado.</div>}
              </ScrollArea>
            </div>

            <div >
              <span className='md:text-[24px] text-[20px] font-semibold'>Filtrar por produto</span>
              <div style={{ display: 'flex', flexDirection: 'row', gap: 12, marginTop: 6, marginBottom: 12, }}>
                <input
                  type="search"
                  id="productName"
                  value={productName}
                  defaultValue={productName}
                  onChange={(e) => setproductName(e.target.value)}
                  placeholder='Ex: Uva'
                  onKeyDown={(e) => { if (e.key === 'Enter') searchProduct() }}
                  className='md:p-4 p-2'
                  style={{
                    borderRadius: 6,
                    border: '2px solid #ccc',
                    width: '100%',
                  }}
                />
                <div onClick={searchProduct}
                  className='md:w-[58px] md:h-[58px] w-[46px] h-[42px]'
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', backgroundColor: '#20202060', borderRadius: 6, justifyContent: 'center', alignItems: 'center', }}>
                  <Search size={20} color='#fff' />
                </div>
              </div>
              <ScrollArea className='md:h-[210px] h-[120px]'>
                {products?.slice(0, 10)?.map((item) => (
                  <CardProduct key={item.id} item={item} />
                ))}
                {products?.length === 0 && <div className="text-center py-8">Nenhum produto encontrado.</div>}
              </ScrollArea>
            </div>

            <DrawerClose>
              <Button className='md:h-[68px] h-[58px] md:text-[22px] text-[18px]' onClick={handleSearch} style={{ backgroundColor: colors.color.primary, width: '100%', marginTop: 20,  }}>Gerar agora</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      </CardContent>
    </Card >
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

const SingleCharts = ({ tab, line, loadingDay }) => {
  if (!line) return null;

  const selectColor = tab === 'Saída' ? '#3590F3' : tab === 'Entrada' ? '#019866' : '#FFB238';
  return (
    <div style={{ gap: '20px', display: 'flex', flexDirection: 'column', borderWidth: 2, borderColor: '#f1f1f1', margin: '0px 26px', borderRadius: 8, marginBottom: 20, }}>
      {/* Gráfico de Linha */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 8, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 className='text-[18px] md:text-[24px] font-semibold'> Gráfico de {tab}</h3>
        </div>
        <ResponsiveContainer width="100%" height={200} style={{ marginLeft: -30 }}>
          <LineChart data={line}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: 'gray', fontSize: 12 }} />
            <YAxis tick={{ fill: 'gray', fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={selectColor} strokeWidth={3}
              name="Valores" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 8, padding: '0px 20px 20px 20px' }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 24, fontWeight: 'bold' }}>Tabela</h3>
        </div>
        <div style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: '#d1d1d1', }}>
          <div style={{ display: 'flex', }}>
            <div style={{ width: '40%', textAlign: 'center', padding: 6, backgroundColor: '#00000015', color: '#000' }}>Data</div>
            <div style={{ width: '60%', textAlign: 'center', padding: 6, backgroundColor: '#F1F1F1', color: '#000' }}>Valor</div>
          </div>
          {line?.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                backgroundColor: index % 2 ? '#f1f1f1' : '#FFF',
                padding: 4,
              }}
            >
              <div style={{ width: '40%', textAlign: 'center' }}>{item.label}</div>
              <div style={{ width: '60%', textAlign: 'center' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/*

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

              name="Valores"
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

const Items = ({ data, storeId }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-8">Nenhum produto encontrado.</div>
  }
  return (
    <div className='px-6'>
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>
      <div className="space-y-4">
        {data.map((item) => (
          <ProductCard key={item.id} item={item} storeId={storeId} />
        ))}
      </div>
    </div>
  )
}
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
*/