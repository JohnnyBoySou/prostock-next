"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { loginUser } from '@/hooks/user'
import { getToken } from '@/hooks/token'
import { Checkbox } from "@/components/ui/checkbox"

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [session, setsession] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.')
      setIsLoading(false)
      return
    }
    try {
      await loginUser(email, password, session)
      router.push('/stores')
    } catch (error: any) {
      setError('E-mail ou senha incorretos.')
    } finally {
      setIsLoading(false)
    }
  }

  const getAuth = async () => {
    try {
      const res = await getToken();
      if (res) {
        router.push('/stores')
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    getAuth()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Card className="w-[350px]">
        <CardHeader>
          <img src="/logo.png" className="w-20 h-20 rounded-lg align-center m-auto" />
          <CardTitle className="text-2xl hidden">Entrar</CardTitle>
          <CardDescription className='hidden'>Digite seu email e senha para acessar sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="email"
                  placeholder="Ex.: email@exemplo.com"
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Input
                  id="password"
                  label='Senha'
                  placeholder="Ex.: ********"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </form>
          <div className="align-start flex space-x-2 mt-4">
            <Checkbox onClick={() => setsession(!session)} id="terms1" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Manter conectado
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex-col'>
          
          <Button onClick={handleSubmit} disabled={isLoading} className="w-full" style={{ backgroundColor: '#019866', }}>
            {isLoading ? 'Enviando' : 'Entrar'}
          </Button>
          {error && <div className='bg-red-200  mt-2 py-2 px-4 w-max  rounded-md'><p className="text-red-500">{error}</p></div>}
        </CardFooter>
      </Card>


      <p className="mt-8 text-gray-500 w-[300px] text-center">
        Ao continuar, você concorda com nossos
        <a href="/privacy" className="text-gray-700 underline"> Politica de Privacidade </a>
        e
        <a href="/terms" className="text-gray-700 underline"> Termos de Uso</a>.
      </p>
    </div>
  )
}

