"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { stores } from '@/lib/mockData'

export default function StoreSelection() {
  const router = useRouter()

  const handleStoreSelect = (id: string) => {
    router.push(`/dashboard/${id}`)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Select a Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map((store) => (
          <Card key={store.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleStoreSelect(store.id)}>
            <CardHeader>
              <CardTitle>{store.name}</CardTitle>
              <CardDescription>{store.city}, {store.state}</CardDescription>
            </CardHeader>
            <CardContent>
              <p><strong>Status:</strong> <Badge variant={store.status === 'active' ? 'default' : 'secondary'}>{store.status}</Badge></p>
              <p><strong>CNPJ:</strong> {store.cnpj}</p>
              <p><strong>Email:</strong> {store.email}</p>
              <p><strong>Address:</strong> {store.address}</p>
              <p><strong>Phone:</strong> {store.phone}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

