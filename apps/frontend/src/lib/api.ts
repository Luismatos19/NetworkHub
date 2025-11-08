const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ParticipationIntention {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface RegistrationInvite {
  token: string;
  email: string;
  expiresAt: string;
  registrationUrl: string;
}

export interface Member {
  id: string;
  name: string;
  company?: string;
  phone?: string;
  bio?: string;
  status: string;
}

export interface BusinessReferral {
  id: string;
  referrer: { id: string; name: string };
  referred: { id: string; name: string };
  title: string;
  description: string;
  value?: number;
  status: string;
  createdAt: string;
}

async function fetchAPI(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
}

export const participationIntentionsAPI = {
  create: (data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
  }) => fetchAPI('/participation-intentions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  list: (adminSecret: string, status?: string) => fetchAPI(
    `/participation-intentions/admin${status ? `?status=${status}` : ''}`,
    {
      headers: { 'x-admin-secret': adminSecret },
    },
  ),

  approve: (id: string, adminSecret: string) => fetchAPI(
    `/participation-intentions/admin/${id}/approve`,
    {
      method: 'PATCH',
      headers: { 'x-admin-secret': adminSecret },
    },
  ),

  reject: (id: string, adminSecret: string) => fetchAPI(
    `/participation-intentions/admin/${id}/reject`,
    {
      method: 'PATCH',
      headers: { 'x-admin-secret': adminSecret },
    },
  ),
};

export const registrationAPI = {
  validateToken: (token: string) => fetchAPI(`/register/validate/${token}`),

  register: (token: string, data: {
    name: string;
    email: string;
    password: string;
    company?: string;
    phone?: string;
    bio?: string;
  }) => fetchAPI(`/register/${token}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const referralsAPI = {
  getMembers: (memberId: string) => fetchAPI('/referrals/members', {
    headers: { 'x-member-id': memberId },
  }),

  create: (memberId: string, data: {
    referredId: string;
    title: string;
    description: string;
    value?: number;
  }) => fetchAPI('/referrals', {
    method: 'POST',
    headers: { 'x-member-id': memberId },
    body: JSON.stringify(data),
  }),

  list: (memberId: string, type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const query = params.toString();
    return fetchAPI(`/referrals${query ? `?${query}` : ''}`, {
      headers: { 'x-member-id': memberId },
    });
  },

  updateStatus: (memberId: string, id: string, status: string) => fetchAPI(
    `/referrals/${id}/status`,
    {
      method: 'PATCH',
      headers: { 'x-member-id': memberId },
      body: JSON.stringify({ status }),
    },
  ),

  createAcknowledgment: (memberId: string, id: string, data: {
    message: string;
    isPublic?: boolean;
  }) => fetchAPI(`/referrals/${id}/acknowledgments`, {
    method: 'POST',
    headers: { 'x-member-id': memberId },
    body: JSON.stringify(data),
  }),
};

