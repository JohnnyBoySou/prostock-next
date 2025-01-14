"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { selectStore, getStore } from '@/hooks/store'
import { listStore } from '@/app/api/store'
import { Check, ChevronRight } from 'lucide-react'
import colors from '../colors'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useQuery } from '@tanstack/react-query'
import { getToken } from '@/hooks/token'

export default function StoreSelection() {
  const router = useRouter()
  const [store, setstore] = useState();

  const { data: stores, isLoading, error} = useQuery({
    queryKey: [`list stores`],
    queryFn: async () => { const res = await listStore(); return res.data;  }
  });

 
  const fetchStore = async () => {
    try {
      const res = await getStore();
      setstore(res);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchUser = async () => {
    try {
      const res = await getToken();
      if (!res) { 
        router.push('/')
      }
    } catch (error) {
      console.log(error);
    }
   }


  useEffect(() => {
    fetchUser();
    fetchStore();
  }, [])

  return (
    <div className="mx-auto align-middle justify-center items-center flex flex-col px-6 max-w-[440px]">
      <div>
        <h1 className="font-bold mb-4 mt-8" style={{ lineHeight: 1, fontSize: 24, }}>Selecione a loja que deseja visualizar os relatórios</h1>
        {isLoading ? <p>Carregando...</p> :
          <div className="grid gap-4 max-w-[440px]">
            {store && <span className='text-gray-500'>Selecionado</span>}
            {store && <SelectCardStore item={store} />}
            {stores?.length > 0 && <span className='text-gray-500'>Lojas disponíveis</span>}
            <ScrollArea className='h-[400px] max-w-[440px]'>
              {stores?.map((store) => (
                <CardStore item={store} key={store.id} />
              ))}
            </ScrollArea>
            <Button variant='default' className='max-w-[440px]'  style={{ backgroundColor: colors.color.primary, }} onClick={() => {
              router.push(`/dashboard/${store.id}`)
            }}>Ver relatórios da loja</Button>
          </div>
        }
      </div>
    </div>
  )
}



const CardStore = ({ item }) => {
  const router = useRouter()
  const handleStoreSelect = async (store) => {
    try {
      await selectStore(store)
      router.push(`/dashboard/${store.id}`)
    } catch (error) {
      console.log(error)
    }
  }
  const { nome, endereco, status, id } = item;
  return (
    <Card className="cursor-pointer flex-row justify-between max-w-[440px] mb-4 items-center flex hover:shadow-lg transition-shadow bg-white border rounded-lg " onClick={() => handleStoreSelect(item)}>
      <CardHeader>
        <CardTitle>{nome?.length > 24 ? nome.slice(0,24) + '...' : nome}</CardTitle>
        <CardDescription>{endereco} • <Badge className='uppercase' variant={status == 'ativo' ? 'default' : 'secondary'}>{status}</Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className='justify-center items-center'>
        <div className='mt-5'>
          <ChevronRight size={32} color={colors.color.primary} />
        </div>
      </CardContent>
    </Card>
  )
}
const SelectCardStore = ({ item }) => {
  const { nome, endereco, status, id } = item;
  return (
    <Card className=" flex-row justify-between max-w-[440px] items-center flex hover:shadow-lg transition-shadow rounded-lg"
      style={{ backgroundColor: colors.color.primary, }}>
      <CardHeader>
        <CardTitle className='text-white'>{nome.length > 20 ? nome.slice(0,20) + '...' : nome}</CardTitle>
        <CardDescription
          className='text-white'>{endereco} • <Badge className='uppercase' variant={status == 'ativo' ? 'default' : 'secondary'}>{status}</Badge>
        </CardDescription>
      </CardHeader>

      <CardContent className='justify-center items-center'>
        <div className='mt-5'>
          <Check size={32} color='#fff' />
        </div>
      </CardContent>
    </Card>
  )
}