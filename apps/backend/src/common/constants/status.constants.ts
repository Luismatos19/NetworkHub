export const INTENTION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const MEMBER_STATUS = {
  ACTIVE: 'active',
  PENDING: 'pending',
  INACTIVE: 'inactive',
} as const;

export const REFERRAL_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  CLOSED: 'closed',
  LOST: 'lost',
} as const;

export const REFERRAL_TYPE = {
  SENT: 'sent',
  RECEIVED: 'received',
} as const;

export const USER_ROLE = {
  ADMIN: 'admin',
  MEMBER: 'member',
} as const;

export const TOKEN_EXPIRATION_DAYS = 7;

