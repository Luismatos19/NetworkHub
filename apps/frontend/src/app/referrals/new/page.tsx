'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { referralsAPI } from '@/lib/api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface Member {
  id: string;
  name: string;
  company?: string;
}

export default function NewReferralPage() {
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    referredId: '',
    title: '',
    description: '',
    value: '',
  });

  useEffect(() => {
    const savedMemberId = localStorage.getItem('member_id');
    if (savedMemberId) {
      setMemberId(savedMemberId);
      loadMembers(savedMemberId);
    } else {
      router.push('/referrals');
    }
  }, [router]);

  const loadMembers = async (id: string) => {
    try {
      const data = await referralsAPI.getMembers(id);
      setMembers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar membros');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await referralsAPI.create(memberId, {
        referredId: formData.referredId,
        title: formData.title,
        description: formData.description,
        value: formData.value ? parseFloat(formData.value) : undefined,
      });

      router.push('/referrals');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar indicação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Nova Indicação de Negócio
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Indicar para *
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.referredId}
              onChange={(e) =>
                setFormData({ ...formData, referredId: e.target.value })
              }
            >
              <option value="">Selecione um membro</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.company ? `- ${member.company}` : ''}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Título *"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <Input
            label="Valor Estimado (R$)"
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Criar Indicação
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/referrals')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

