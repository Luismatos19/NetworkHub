import { ListParticipationIntentionsUseCase } from "../../../../../../core/application/use-cases/participation-intentions/list-participation-intentions.usecase";

describe("ListParticipationIntentionsUseCase", () => {
  const findByStatusMock = jest.fn();
  const findAllMock = jest.fn();

  const makeUseCase = () =>
    new ListParticipationIntentionsUseCase({
      findByStatus: findByStatusMock,
      findAll: findAllMock,
    } as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delegate to repository.findByStatus when a status is provided", async () => {
    const intentions = [{ id: "1" }];
    findByStatusMock.mockResolvedValue(intentions);
    const useCase = makeUseCase();

    const result = await useCase.execute("approved");

    expect(findByStatusMock).toHaveBeenCalledWith("approved");
    expect(result).toEqual(intentions);
    expect(findAllMock).not.toHaveBeenCalled();
  });

  it("should fallback to repository.findAll when no status is provided", async () => {
    const intentions = [{ id: "2" }];
    findAllMock.mockResolvedValue(intentions);
    const useCase = makeUseCase();

    const result = await useCase.execute();

    expect(findAllMock).toHaveBeenCalled();
    expect(result).toEqual(intentions);
    expect(findByStatusMock).not.toHaveBeenCalled();
  });
});
