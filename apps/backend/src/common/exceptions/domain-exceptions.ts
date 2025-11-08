import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

export class IntentionNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(`Intenção de participação não encontrada${id ? `: ${id}` : ''}`);
  }
}

export class IntentionAlreadyReviewedException extends BadRequestException {
  constructor(status: string) {
    super(`Intenção já foi revisada com status: ${status}`);
  }
}

export class InvalidTokenException extends BadRequestException {
  constructor(message = 'Token inválido') {
    super(message);
  }
}

export class TokenExpiredException extends BadRequestException {
  constructor() {
    super('Token expirado');
  }
}

export class TokenAlreadyUsedException extends BadRequestException {
  constructor() {
    super('Token já foi utilizado');
  }
}

export class EmailMismatchException extends BadRequestException {
  constructor() {
    super('Email não corresponde ao convite');
  }
}

export class UserAlreadyExistsException extends ConflictException {
  constructor(email: string) {
    super(`Usuário com email ${email} já está cadastrado`);
  }
}

export class MemberNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(`Membro não encontrado${id ? `: ${id}` : ''}`);
  }
}

export class ReferralNotFoundException extends NotFoundException {
  constructor(id?: string) {
    super(`Indicação não encontrada${id ? `: ${id}` : ''}`);
  }
}

export class AccessDeniedException extends BadRequestException {
  constructor(message = 'Acesso negado') {
    super(message);
  }
}

export class SelfReferralException extends BadRequestException {
  constructor() {
    super('Não é possível indicar para si mesmo');
  }
}

export class UnauthorizedActionException extends BadRequestException {
  constructor(action: string) {
    super(`Apenas o membro autorizado pode ${action}`);
  }
}

