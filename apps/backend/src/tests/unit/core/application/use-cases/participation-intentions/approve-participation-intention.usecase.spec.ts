import { ApproveParticipationIntentionUseCase } from "../../../../../../core/application/use-cases/participation-intentions/approve-participation-intention.usecase";
import {
  IntentionAlreadyReviewedException,
  IntentionNotFoundException,
} from "../../../../../../common/exceptions/domain-exceptions";
import { INTENTION_STATUS } from "../../../../../../common/constants/status.constants";

describe("ApproveParticipationIntentionUseCase", () => {
  const participationRepo = {
    findById: jest.fn(),
  };
  const tokenService = {
    generateToken: jest.fn(),
    calculateExpirationDate: jest.fn(),
  };
  const emailService = {
    sendInviteEmail: jest.fn(),
  };
  const prisma = {
    $transaction: jest.fn(),
  };
  const configService = {
    get: jest.fn(),
  };

  const makeUseCase = () =>
    new ApproveParticipationIntentionUseCase(
      participationRepo as any,
      tokenService as any,
      emailService as any,
      prisma as any,
      configService as any
    );

  const intention = {
    id: "intention-1",
    name: "Jane Doe",
    email: "jane@example.com",
    status: INTENTION_STATUS.PENDING,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when the intention does not exist", async () => {
    participationRepo.findById.mockResolvedValue(null);
    const useCase = makeUseCase();

    await expect(useCase.execute("missing-id")).rejects.toBeInstanceOf(
      IntentionNotFoundException
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("should throw when the intention is already reviewed", async () => {
    participationRepo.findById.mockResolvedValue({
      ...intention,
      status: INTENTION_STATUS.APPROVED,
    });
    const useCase = makeUseCase();

    await expect(useCase.execute(intention.id)).rejects.toBeInstanceOf(
      IntentionAlreadyReviewedException
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it("should approve the intention, create invite and send email", async () => {
    const token = "token-123";
    const expiresAt = new Date("2025-12-01T00:00:00Z");
    const updatedIntention = { ...intention, status: INTENTION_STATUS.APPROVED };
    const inviteRecord = { id: "invite-1", token, email: intention.email, expiresAt };

    participationRepo.findById.mockResolvedValue(intention);
    tokenService.generateToken.mockReturnValue(token);
    tokenService.calculateExpirationDate.mockReturnValue(expiresAt);
    configService.get.mockReturnValue("http://frontend.test");

    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        participationIntention: {
          update: jest.fn().mockResolvedValue(updatedIntention),
        },
        registrationInvite: {
          create: jest.fn().mockResolvedValue(inviteRecord),
        },
      })
    );

    const useCase = makeUseCase();
    const result = await useCase.execute(intention.id);

    expect(prisma.$transaction).toHaveBeenCalled();
    expect(tokenService.generateToken).toHaveBeenCalled();
    expect(emailService.sendInviteEmail).toHaveBeenCalledWith({
      to: intention.email,
      name: intention.name,
      token,
    });
    expect(result).toEqual({
      intention: updatedIntention,
      invite: {
        ...inviteRecord,
        registrationUrl: `http://frontend.test/register/${token}`,
      },
    });
  });
});

