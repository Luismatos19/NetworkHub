export class ParticipationIntentionResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  status: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.company = data.company;
    this.message = data.message;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}

