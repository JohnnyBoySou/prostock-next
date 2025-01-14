'use client'
import React, { useEffect, useState } from 'react';
import { getStore } from '@/hooks/store';
import colors from '@/app/colors'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronRight, LogOut, Store } from 'lucide-react';
import { deleteToken } from '@/hooks/token';

export default function StoresLayout({
  children,
}) {

  const router = useRouter()
  const handleLogout = () => {
    try {
      const res = deleteToken();
      router.replace('/')
    } catch (error) {
    }
  }

  const [store, setstore] = useState();
  const [loading, setloading] = useState();
  useEffect(() => {
    fetchStore();
  }, [])

  const fetchStore = async () => {
    setloading(true)
    try {
      const res = await getStore();
      setstore(res);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  }

  const handleStore = () => {
    router.push('/stores')
  }
  return (
    <div>
      <nav className=" text-white p-4 fixed w-full z-10" style={{ backgroundColor: colors.color.primary, }}>
        <div className="container mx-auto flex justify-between items-center">
          <div className='flex-row flex'>
            <Link href="/stores" className="text-xl font-bold ml-2">
              <div className='flex-row flex align-center justify-center items-center'>
                <img src="/logo_white.svg" alt="ProStock" className="w-12 h-12" />
                ProStock
              </div>
            </Link>
          </div>
          <div className='flex-row flex gap-x-4'>
            <Button style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff30',}}  onClick={handleStore}>
              <Store size={18} color='#fff' />
            </Button>
            <Button style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff30',}}  onClick={handleLogout}>
              <LogOut size={18} color='#fff' />
            </Button>
          </div>
        </div>
      </nav>
      <div style={{ paddingTop: 80, paddingHorizontal: 20, }}>
      {children}
      </div>
    </div>
  )
}
const SelectCardStore = ({ item }) => {
  if (!item) return null;
  const { nome, endereco, status, id } = item;
  const router = useRouter()
  const handleStore = () => {
    router.push('/stores')
  }
  return (
    <div onClick={handleStore} className="flex-row ml-8 hidden sm:flex justify-between w-[300px] py-2 px-3 items-center cursor-pointer transition-shadow rounded-lg"
      style={{ backgroundColor: '#ffffff20', }}>
      <div>
        <h2 className='text-white text-md -mb-1'>{nome}</h2>
        <span
          className='text-white opacity-75 text-sm -mt-1'>{endereco}
        </span>
      </div>

      <div className='justify-center items-center'>
        <ChevronRight size={32} color='#fff' />
      </div>
    </div>
  )
}