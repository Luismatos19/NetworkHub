import { Injectable } from "@nestjs/common";
import { MemberRepository } from "../../../../infra/database/repositories/member.repository";
import { MemberNotFoundException } from "../../../../common/exceptions/domain-exceptions";

@Injectable()
export class FindMemberByEmailUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute(email: string) {
    const member = await this.memberRepository.findByUserEmail(email);
    if (!member) {
      throw new MemberNotFoundException(email);
    }
    return member;
  }
}
