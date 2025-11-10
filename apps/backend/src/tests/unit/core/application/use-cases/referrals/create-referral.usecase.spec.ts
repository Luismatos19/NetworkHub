import { CreateReferralUseCase } from "../../../../../../core/application/use-cases/referrals/create-referral.usecase";
import {
  MemberNotFoundException,
  SelfReferralException,
} from "../../../../../../common/exceptions/domain-exceptions";
import { REFERRAL_STATUS } from "../../../../../../common/constants/status.constants";

describe("CreateReferralUseCase", () => {
  const referralRepository = {
    create: jest.fn(),
  };
  const memberRepository = {
    findById: jest.fn(),
  };

  const makeUseCase = () =>
    new CreateReferralUseCase(
      referralRepository as any,
      memberRepository as any
    );

  const referrerId = "member-1";
  const referredId = "member-2";
  const input = {
    referrerId,
    referredId,
    title: "Referral",
    description: "Description",
    value: 1000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when referrer does not exist", async () => {
    memberRepository.findById.mockResolvedValueOnce(null);
    const useCase = makeUseCase();

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      MemberNotFoundException
    );
    expect(referralRepository.create).not.toHaveBeenCalled();
  });

  it("should throw when referred member does not exist", async () => {
    memberRepository.findById
      .mockResolvedValueOnce({ id: referrerId })
      .mockResolvedValueOnce(null);
    const useCase = makeUseCase();

    await expect(useCase.execute(input)).rejects.toBeInstanceOf(
      MemberNotFoundException
    );
    expect(referralRepository.create).not.toHaveBeenCalled();
  });

  it("should throw when referrer and referred are the same", async () => {
    memberRepository.findById.mockResolvedValue({ id: referrerId });
    const useCase = makeUseCase();

    await expect(
      useCase.execute({ ...input, referredId: referrerId })
    ).rejects.toBeInstanceOf(SelfReferralException);
  });

  it("should create a referral with pending status", async () => {
    const createdReferral = { id: "referral-1", status: REFERRAL_STATUS.PENDING };
    memberRepository.findById.mockResolvedValue({ id: referrerId });
    referralRepository.create.mockResolvedValue(createdReferral);
    const useCase = makeUseCase();

    const result = await useCase.execute(input);

    expect(referralRepository.create).toHaveBeenCalledWith({
      referrer: { connect: { id: referrerId } },
      referred: { connect: { id: referredId } },
      title: input.title,
      description: input.description,
      value: input.value,
      status: REFERRAL_STATUS.PENDING,
    });
    expect(result).toEqual(createdReferral);
  });
});

