import { CreateAcknowledgmentUseCase } from "../../../../../../core/application/use-cases/referrals/create-acknowledgment.usecase";
import {
  ReferralNotFoundException,
  UnauthorizedActionException,
} from "../../../../../../common/exceptions/domain-exceptions";

describe("CreateAcknowledgmentUseCase", () => {
  const acknowledgmentRepository = {
    create: jest.fn(),
  };
  const referralRepository = {
    findById: jest.fn(),
  };

  const makeUseCase = () =>
    new CreateAcknowledgmentUseCase(
      acknowledgmentRepository as any,
      referralRepository as any
    );

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
      useCase.execute({
        referralId: referral.id,
        fromMemberId: referral.referredId,
        message: "Thanks!",
      })
    ).rejects.toBeInstanceOf(ReferralNotFoundException);
  });

  it("should throw when member is not allowed to acknowledge", async () => {
    referralRepository.findById.mockResolvedValue(referral);
    const useCase = makeUseCase();

    await expect(
      useCase.execute({
        referralId: referral.id,
        fromMemberId: referral.referrerId,
        message: "Thanks!",
      })
    ).rejects.toBeInstanceOf(UnauthorizedActionException);
    expect(acknowledgmentRepository.create).not.toHaveBeenCalled();
  });

  it("should create an acknowledgment with default visibility", async () => {
    referralRepository.findById.mockResolvedValue(referral);
    const acknowledgment = { id: "ack-1" };
    acknowledgmentRepository.create.mockResolvedValue(acknowledgment);
    const useCase = makeUseCase();

    const result = await useCase.execute({
      referralId: referral.id,
      fromMemberId: referral.referredId,
      message: "Great job!",
    });

    expect(acknowledgmentRepository.create).toHaveBeenCalledWith({
      referral: { connect: { id: referral.id } },
      fromMember: { connect: { id: referral.referredId } },
      toMember: { connect: { id: referral.referrerId } },
      message: "Great job!",
      isPublic: true,
    });
    expect(result).toEqual(acknowledgment);
  });
});

