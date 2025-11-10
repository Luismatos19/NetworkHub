import { GetReferralUseCase } from "../../../../../../core/application/use-cases/referrals/get-referral.usecase";
import {
  AccessDeniedException,
  ReferralNotFoundException,
} from "../../../../../../common/exceptions/domain-exceptions";

describe("GetReferralUseCase", () => {
  const referralRepository = {
    findById: jest.fn(),
  };

  const makeUseCase = () =>
    new GetReferralUseCase(referralRepository as any);

  const referral = {
    id: "referral-1",
    referrerId: "member-1",
    referredId: "member-2",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when referral is not found", async () => {
    referralRepository.findById.mockResolvedValue(null);
    const useCase = makeUseCase();

    await expect(
      useCase.execute({ referralId: referral.id, memberId: referral.referrerId })
    ).rejects.toBeInstanceOf(ReferralNotFoundException);
  });

  it("should throw when member does not have access", async () => {
    referralRepository.findById.mockResolvedValue(referral);
    const useCase = makeUseCase();

    await expect(
      useCase.execute({ referralId: referral.id, memberId: "others" })
    ).rejects.toBeInstanceOf(AccessDeniedException);
  });

  it("should return the referral when member participates", async () => {
    referralRepository.findById.mockResolvedValue(referral);
    const useCase = makeUseCase();

    const result = await useCase.execute({
      referralId: referral.id,
      memberId: referral.referrerId,
    });

    expect(result).toEqual(referral);
  });
});

