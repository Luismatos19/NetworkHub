import { CreateParticipationIntentionUseCase } from "../../../../../../core/application/use-cases/participation-intentions/create-participation-intention.usecase";
import { INTENTION_STATUS } from "../../../../../../common/constants/status.constants";

describe("CreateParticipationIntentionUseCase", () => {
  const createMock = jest.fn();
  const makeUseCase = () =>
    new CreateParticipationIntentionUseCase({
      create: createMock,
    } as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should persist a participation intention with pending status", async () => {
    const useCase = makeUseCase();
    const dto = {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "123456789",
      company: "Acme Inc.",
      message: "Interested in joining",
    };
    const created = {
      id: "intention-1",
      ...dto,
      status: INTENTION_STATUS.PENDING,
    };

    createMock.mockResolvedValue(created);

    const result = await useCase.execute(dto);

    expect(createMock).toHaveBeenCalledWith({
      ...dto,
      status: INTENTION_STATUS.PENDING,
    });
    expect(result).toEqual(created);
  });
});
