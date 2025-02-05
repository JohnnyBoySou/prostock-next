"use client"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { ScrollArea } from "@/components/ui/scroll-area"
import colors from '@/app/colors'
import Tabs from '@/components/custom/tabs'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import { Check,} from 'lucide-react'
//API
import { listSupplierStore } from '@/app/api/supplier'
import { showReportProduct, showReportProductLine } from '@/app/api/report'

export default function ProductReportPage() {
  const params = useParams()
  const productId = params.productId
  const storeId = params.id

  const dateNow = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  const [dateC, setdateC] = useState('2025-01-01');
  const [dateF, setdateF] = useState(dateNow);

  const [tab, settab] = useState('Saída');
  const types = ['Saída', 'Entrada', 'Perdas','Devoluções',];
  const [fornecedor, setfornecedor] = useState();

  const { data, isLoading,  } = useQuery({
    queryKey: ["product report", productId, storeId],
    queryFn: () => showReportProduct(productId, storeId)
  })

  const { data: line, isLoading: loadingDay, refetch } = useQuery({
    queryKey: ["stores product daylist single", productId, fornecedor, tab, dateC, dateF],
    queryFn: async () => {
      const res = await showReportProductLine(productId, storeId, fornecedor, dateC, dateF, tab);
      return res;
    }
  });
  const { data: suppliers, isLoading: loadingSuppliers } = useQuery({
    queryKey: ["supplier list store", storeId],
    queryFn: () => listSupplierStore(storeId, 1,)
  })

  useEffect(() => {
    refetch();
  }, [fornecedor, tab, dateC, dateF]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Carregando...</span>
      </div>
    )
  }
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Store item={data} tab={tab} settab={settab} types={types} tem={data} suppliers={suppliers} setdateC={setdateC} setdateF={setdateF} dateC={dateC} dateF={dateF} setfornecedor={setfornecedor} fornecedor={fornecedor}/>
      <Tabs types={types} value={tab} setValue={settab} />
      <SingleCharts data={data} tab={tab} line={line} loadingDay={loadingDay} />
    </div>
  )
}

const Store = ({ item, fornecedor, suppliers, setfornecedor, setdateC, setdateF, dateC, dateF, }) => {
  if (!item) return null;
  const { nome, status, descricao, estoque_maximo, estoque_minimo, unidade } = item
  const CardSupplier = ({ item }) => {
    if (!item) return null;
    const { id, status, cidade, id_loja, nome_fantasia, } = item;
    return (
      <div onClick={() => { setfornecedor(fornecedor === id ? '' : id) }} style={{ marginBottom: 10, }}>
        <div pv={20} className='flex-row flex justify-between items-center' style={{ backgroundColor: '#FFF', padding: 12, borderRadius: 8, borderWidth: 2, borderColor: fornecedor == id ? colors.color.green : '#D1D1D1' }}>
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
    <div className='border mt-4 px-4 py-4 rounded-lg'>
      <h2 style={{ fontSize: 28, lineHeight: 1, marginTop: -8, }}>{nome}</h2>
      <div>
        <p className="text-gray-600">{descricao} - {status} - {unidade}</p>
        <p className="text-gray-600">Máx: {estoque_maximo} - Mín: {estoque_minimo}</p>
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
              <Button  style={{ backgroundColor: colors.color.primary, width: '100%', marginTop: 20, fontSize: 18, height: 52, }}>Definir filtros</Button>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
    </div>
  )
}

const SingleCharts = ({ data, tab, line, loadingDay }) => {
  if (!data || !line) return null;

  const meses = data?.estatisticas || [];

  // Dados para os gráficos
  const ocupacao = meses.map((mes) => ({
    value: mes.estoque_ocupado,
    label: mes.mes.slice(0, 3),
    frontColor: '#FF1828',
  }));

  const entrada = meses.map((mes) => ({
    value: mes.entrada,
    label: mes.mes.slice(0, 3),
    frontColor: '#019866',
  }));

  const saida = meses.map((mes) => ({
    value: mes.saida,
    label: mes.mes.slice(0, 3),
    frontColor: '#3590F3',
  }));

  const perdas = meses.map((mes) => ({
    value: mes.perdas,
    label: mes.mes.slice(0, 3),
    frontColor: '#FFB238',
  }));

  const selectData =
    tab === 'Saída' ? saida :
      tab === 'Entrada' ? entrada :
        tab === 'Perdas' ? perdas :
          tab === 'Ocupação' ? ocupacao :
            null;

  return (
    <div style={{ gap: '20px', display: 'flex', flexDirection: 'column' }}>
      {/* Gráfico de Linha */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 8, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 24, fontWeight: 'bold' }}>Gráfico de Linha</h3>
          <p>Por data selecionada</p>
        </div>
        {loadingDay ? (
          <p>Carregando...</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={line}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'gray', fontSize: 12 }} />
              <YAxis tick={{ fill: 'gray', fontSize: 12 }} />
                <Tooltip />
              <Line type="monotone" dataKey="value" stroke={selectData[0].frontColor} strokeWidth={3} 
              name="Valores"/>
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Gráfico de Barras */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 8, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 24, fontWeight: 'bold' }}>Gráfico de Barras</h3>
          <p>Últimos 3 meses</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={selectData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fill: 'gray', fontSize: 12 }} />
            <YAxis tick={{ fill: 'gray', fontSize: 12 }} />
            <Tooltip />
            <Legend displayName='Valor'/>
            <Bar
              dataKey="value"
              name="Valores"
              shape={(props) => {
                const { fill, x, y, width, height, payload } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={payload.frontColor}
                    radius={4}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela */}
      <div style={{ backgroundColor: '#FFF', borderRadius: 8, padding: 20 }}>
        <div style={{ marginBottom: 12 }}>
          <h3>Tabela</h3>
          <p>Últimos 3 meses</p>
        </div>
        <div style={{ borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ display: 'flex', backgroundColor: '#000', padding: 4, color: '#F1F1F1' }}>
            <div style={{ width: '30%', textAlign: 'center' }}>Data</div>
            <div style={{ width: '70%', textAlign: 'center' }}>Valor</div>
          </div>
          {selectData.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                backgroundColor: index % 2 ? '#f1f1f1' : '#FFF',
                padding: 4,
              }}
            >
              <div style={{ width: '30%', textAlign: 'center' }}>{item.label}</div>
              <div style={{ width: '70%', textAlign: 'center' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/*

const Charts = ({ data }) => {
  const meses = data?.estatisticas

  const chartData = meses.map((mes, index) => ({
    name: mes.mes.slice(0, 3),
    ocupacao: mes.estoque_ocupado,
    entrada: mes.entrada,
    saida: mes.saida,
    perdas: mes.perdas
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
        color="#019866"
        maxValue={Math.max(...chartData.map(item => item.entrada))}
      />
      <ChartCard
        title="Saída"
        data={chartData}
        dataKey="saida"
        color="#3590F3"
        maxValue={Math.max(...chartData.map(item => item.saida))}
      />
      <ChartCard
        title="Perdas"
        data={chartData}
        dataKey="perdas"
        color="#FFB238"
        maxValue={Math.max(...chartData.map(item => item.perdas))}
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
*/