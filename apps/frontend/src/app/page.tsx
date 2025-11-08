import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">NetworkHubs</h1>
        <p className="text-gray-600">Plataforma de Gestão para Grupos de Networking</p>
        <div className="space-y-4 mt-8">
          <Link
            href="/participation-form"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Quero Participar
          </Link>
          <Link
            href="/admin/intentions"
            className="block w-full bg-gray-200 text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Área do Administrador
          </Link>
          <Link
            href="/referrals"
            className="block w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Sistema de Indicações
          </Link>
        </div>
      </div>
    </div>
  );
}
