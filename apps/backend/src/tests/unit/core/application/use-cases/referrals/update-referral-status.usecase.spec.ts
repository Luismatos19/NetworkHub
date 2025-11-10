import { UpdateReferralStatusUseCase } from "../../../../../../core/application/use-cases/referrals/update-referral-status.usecase";
import { REFERRAL_STATUS } from "../../../../../../common/constants/status.constants";
import { UnauthorizedActionException } from "../../../../../../common/exceptions/domain-exceptions";

describe("UpdateReferralStatusUseCase", () => {
  const referralRepository = {
    updateStatus: jest.fn(),
  };
  const getReferralUseCase = {
    execute: jest.fn(),
  };

  const makeUseCase = () =>
    new UpdateReferralStatusUseCase(
      referralRepository as any,
      getReferralUseCase as any
    );

  const referral = {
    id: "referral-1",
    referrerId: "member-1",
    referredId: "member-2",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when requester is not the referred member", async () => {
    getReferralUseCase.execute.mockResolvedValue(referral);
    const useCase = makeUseCase();

    await expect(
      useCase.execute({
        referralId: referral.id,
        memberId: "member-3",
        status: REFERRAL_STATUS.CLOSED,
      })
    ).rejects.toBeInstanceOf(UnauthorizedActionException);
    expect(referralRepository.updateStatus).not.toHaveBeenCalled();
  });

  it("should update status and set completion date when closing referral", async () => {
    getReferralUseCase.execute.mockResolvedValue(referral);
    referralRepository.updateStatus.mockResolvedValue({
      ...referral,
      status: REFERRAL_STATUS.CLOSED,
    });
    const useCase = makeUseCase();

    const result = await useCase.execute({
      referralId: referral.id,
      memberId: referral.referredId,
      status: REFERRAL_STATUS.CLOSED,
    });

    expect(referralRepository.updateStatus).toHaveBeenCalledWith(
      referral.id,
      REFERRAL_STATUS.CLOSED,
      expect.any(Date)
    );
    expect(result).toEqual({
      ...referral,
      status: REFERRAL_STATUS.CLOSED,
    });
  });
});

