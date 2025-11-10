import { ListMembersUseCase } from "../../../../../../core/application/use-cases/referrals/list-members.usecase";

describe("ListMembersUseCase", () => {
  const memberRepository = {
    findActiveMembers: jest.fn(),
  };

  const makeUseCase = () =>
    new ListMembersUseCase(memberRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return active members from repository", async () => {
    const members = [{ id: "member-1" }];
    memberRepository.findActiveMembers.mockResolvedValue(members);
    const useCase = makeUseCase();

    const result = await useCase.execute();

    expect(memberRepository.findActiveMembers).toHaveBeenCalled();
    expect(result).toEqual(members);
  });
});

