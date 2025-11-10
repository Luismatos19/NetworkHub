import { ValidateRegistrationTokenUseCase } from "../../../../../../core/application/use-cases/registration/validate-registration-token.usecase";

describe("ValidateRegistrationTokenUseCase", () => {
  const inviteRepository = {
    findByToken: jest.fn(),
  };
  const tokenService = {
    isTokenExpired: jest.fn(),
  };

  const makeUseCase = () =>
    new ValidateRegistrationTokenUseCase(
      inviteRepository as any,
      tokenService as any
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should flag an unknown token as invalid", async () => {
    inviteRepository.findByToken.mockResolvedValue(null);
    const useCase = makeUseCase();

    const result = await useCase.execute("missing-token");

    expect(result).toEqual({
      valid: false,
      message: "Token inválido",
    });
  });

  it("should flag a token that was already used", async () => {
    const invite = {
      token: "token-1",
      email: "user@example.com",
      expiresAt: new Date(),
      usedAt: new Date(),
    };
    inviteRepository.findByToken.mockResolvedValue(invite);
    const useCase = makeUseCase();

    const result = await useCase.execute(invite.token);

    expect(result).toEqual({
      valid: false,
      message: "Token já foi utilizado",
    });
  });

  it("should flag an expired token", async () => {
    const invite = {
      token: "token-1",
      email: "user@example.com",
      expiresAt: new Date(),
      usedAt: null,
    };
    inviteRepository.findByToken.mockResolvedValue(invite);
    tokenService.isTokenExpired.mockReturnValue(true);
    const useCase = makeUseCase();

    const result = await useCase.execute(invite.token);

    expect(tokenService.isTokenExpired).toHaveBeenCalledWith(invite.expiresAt);
    expect(result).toEqual({
      valid: false,
      message: "Token expirado",
    });
  });

  it("should return invite data when token is valid", async () => {
    const invite = {
      token: "token-1",
      email: "user@example.com",
      expiresAt: new Date(),
      usedAt: null,
    };
    inviteRepository.findByToken.mockResolvedValue(invite);
    tokenService.isTokenExpired.mockReturnValue(false);
    const useCase = makeUseCase();

    const result = await useCase.execute(invite.token);

    expect(result).toEqual({
      valid: true,
      email: invite.email,
      expiresAt: invite.expiresAt,
    });
  });
});
