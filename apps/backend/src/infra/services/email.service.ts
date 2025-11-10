import { Injectable } from '@nestjs/common';

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

@Injectable()
export class EmailService {
  async sendInviteEmail(data: {
    to: string;
    name: string;
    token: string;
  }): Promise<void> {
    const registrationUrl = `http://localhost:3000/register/${data.token}`;
    
    console.log(`
      ============================================
      EMAIL SIMULADO - Convite de Cadastro
      ============================================
      Para: ${data.to}
      Assunto: Convite para se cadastrar no NetworkHubs
      
      Olá ${data.name},
      
      Sua intenção de participação foi aprovada!
      Clique no link abaixo para completar seu cadastro:
      
      ${registrationUrl}
      
      Este link expira em 7 dias.
      ============================================
    `);
  }
}

