import { FindMemberByEmailUseCase } from "../../../../../../core/application/use-cases/referrals/find-member-by-email.usecase";
import { MemberNotFoundException } from "../../../../../../common/exceptions/domain-exceptions";

describe("FindMemberByEmailUseCase", () => {
  const memberRepository = {
    findByUserEmail: jest.fn(),
  };

  const makeUseCase = () =>
    new FindMemberByEmailUseCase(memberRepository as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when member is not found", async () => {
    memberRepository.findByUserEmail.mockResolvedValue(null);
    const useCase = makeUseCase();

    await expect(useCase.execute("missing@example.com")).rejects.toBeInstanceOf(
      MemberNotFoundException
    );
  });

  it("should return member when found", async () => {
    const member = { id: "member-1" };
    memberRepository.findByUserEmail.mockResolvedValue(member);
    const useCase = makeUseCase();

    const result = await useCase.execute("user@example.com");

    expect(result).toEqual(member);
  });
});

