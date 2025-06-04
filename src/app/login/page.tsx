import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tráfego Dashboard
          </h1>
          <p className="text-gray-600">
            Gerencie suas campanhas de marketing digital
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Login | Tráfego Dashboard',
  description: 'Faça login no seu dashboard de tráfego',
} 