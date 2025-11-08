'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { registrationAPI } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteData, setInviteData] = useState<{
    email: string;
    expiresAt: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    const validateToken = async () => {
      try {
        const result = await registrationAPI.validateToken(token);
        if (result.valid) {
          setIsValid(true);
          setInviteData(result);
          setFormData((prev) => ({ ...prev, email: result.email }));
        } else {
          setIsValid(false);
          setError(result.message || 'Token inválido');
        }
      } catch (err: any) {
        setIsValid(false);
        setError(err.message || 'Erro ao validar token');
      } finally {
        setIsValidating(false);
      }
    };

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      await registrationAPI.register(token, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        company: formData.company,
        phone: formData.phone,
        bio: formData.bio,
      });

      alert('Cadastro realizado com sucesso! Você pode fazer login agora.');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full text-center">
          <p className="text-gray-600">Validando token...</p>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Token Inválido</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={() => router.push('/')}>Voltar ao Início</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Complete seu Cadastro
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Email: {inviteData?.email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo *"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Input
            label="Email *"
            type="email"
            required
            value={formData.email}
            disabled
            className="bg-gray-100"
          />

          <Input
            label="Senha *"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Input
            label="Confirmar Senha *"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />

          <Input
            label="Telefone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <Input
            label="Empresa"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="w-full">
            Cadastrar
          </Button>
        </form>
      </Card>
    </div>
  );
}

