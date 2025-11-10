import { RejectParticipationIntentionUseCase } from "../../../../../../core/application/use-cases/participation-intentions/reject-participation-intention.usecase";
import {
  IntentionAlreadyReviewedException,
  IntentionNotFoundException,
} from "../../../../../../common/exceptions/domain-exceptions";
import { INTENTION_STATUS } from "../../../../../../common/constants/status.constants";

describe("RejectParticipationIntentionUseCase", () => {
  const participationRepo = {
    findById: jest.fn(),
    updateStatus: jest.fn(),
  };

  const makeUseCase = () =>
    new RejectParticipationIntentionUseCase(participationRepo as any);

  const intention = {
    id: "intention-1",
    status: INTENTION_STATUS.PENDING,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when intention is not found", async () => {
    participationRepo.findById.mockResolvedValue(null);
    const useCase = makeUseCase();

    await expect(useCase.execute(intention.id)).rejects.toBeInstanceOf(
      IntentionNotFoundException
    );
    expect(participationRepo.updateStatus).not.toHaveBeenCalled();
  });

  it("should throw when intention is already reviewed", async () => {
    participationRepo.findById.mockResolvedValue({
      ...intention,
      status: INTENTION_STATUS.APPROVED,
    });
    const useCase = makeUseCase();

    await expect(useCase.execute(intention.id)).rejects.toBeInstanceOf(
      IntentionAlreadyReviewedException
    );
    expect(participationRepo.updateStatus).not.toHaveBeenCalled();
  });

  it("should update status to rejected when intention is pending", async () => {
    const rejected = { ...intention, status: INTENTION_STATUS.REJECTED };
    participationRepo.findById.mockResolvedValue(intention);
    participationRepo.updateStatus.mockResolvedValue(rejected);
    const useCase = makeUseCase();

    const result = await useCase.execute(intention.id);

    expect(participationRepo.updateStatus).toHaveBeenCalledWith(
      intention.id,
      INTENTION_STATUS.REJECTED,
      expect.any(Date)
    );
    expect(result).toEqual(rejected);
  });
});

