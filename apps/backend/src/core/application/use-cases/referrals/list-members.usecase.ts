import { Injectable } from "@nestjs/common";
import { MemberRepository } from "../../../../infra/database/repositories/member.repository";

@Injectable()
export class ListMembersUseCase {
  constructor(private readonly memberRepository: MemberRepository) {}

  async execute() {
    return this.memberRepository.findActiveMembers();
  }
}
