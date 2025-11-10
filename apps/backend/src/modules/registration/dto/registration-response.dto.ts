export class MemberResponseDto {
  id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  bio?: string;
  status: string;
  createdAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.company = data.company;
    this.phone = data.phone;
    this.bio = data.bio;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}

