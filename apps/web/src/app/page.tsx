import { redirect } from 'next/navigation'

export default function Home() {
  // Redireciona para o dashboard principal
  redirect('/dash')
}
