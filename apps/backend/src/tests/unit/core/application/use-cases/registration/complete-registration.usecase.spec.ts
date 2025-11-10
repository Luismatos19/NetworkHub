jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { CompleteRegistrationUseCase } from "../../../../../../core/application/use-cases/registration/complete-registration.usecase";
import {
  EmailMismatchException,
  InvalidTokenException,
  UserAlreadyExistsException,
} from "../../../../../../common/exceptions/domain-exceptions";

describe("CompleteRegistrationUseCase", () => {
  const inviteRepository = {
    markAsUsed: jest.fn(),
  };
  const userRepository = {
    findByEmail: jest.fn(),
  };
  const memberRepository = {};
  const passwordService = {
    hash: jest.fn(),
  };
  const prisma = {
    $transaction: jest.fn(),
  };
  const validateTokenUseCase = {
    execute: jest.fn(),
  };

  const makeUseCase = () =>
    new CompleteRegistrationUseCase(
      inviteRepository as any,
      userRepository as any,
      memberRepository as any,
      passwordService as any,
      prisma as any,
      validateTokenUseCase as any
    );

  const token = "token-123";
  const dto = {
    email: "user@example.com",
    password: "secret123",
    name: "User",
    company: "Company",
    phone: "123",
    bio: "Bio",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw when the token is invalid", async () => {
    validateTokenUseCase.execute.mockResolvedValue({
      valid: false,
      message: "Token inválido",
    });
    const useCase = makeUseCase();

    await expect(useCase.execute(token, dto)).rejects.toBeInstanceOf(
      InvalidTokenException
    );
    expect(userRepository.findByEmail).not.toHaveBeenCalled();
  });

  it("should throw when the provided email mismatch the invite", async () => {
    validateTokenUseCase.execute.mockResolvedValue({
      valid: true,
      email: "another@example.com",
      expiresAt: new Date(),
    });
    const useCase = makeUseCase();

    await expect(useCase.execute(token, dto)).rejects.toBeInstanceOf(
      EmailMismatchException
    );
  });

  it("should throw when the user already exists", async () => {
    validateTokenUseCase.execute.mockResolvedValue({
      valid: true,
      email: dto.email,
      expiresAt: new Date(),
    });
    userRepository.findByEmail.mockResolvedValue({ id: "user-1" });
    const useCase = makeUseCase();

    await expect(useCase.execute(token, dto)).rejects.toBeInstanceOf(
      UserAlreadyExistsException
    );
  });

  it("should create the user, member and mark the invite as used", async () => {
    const hashed = "hashed-password";
    validateTokenUseCase.execute.mockResolvedValue({
      valid: true,
      email: dto.email,
      expiresAt: new Date(),
    });
    userRepository.findByEmail.mockResolvedValue(null);
    passwordService.hash.mockResolvedValue(hashed);

    const createdUser = { id: "user-1", email: dto.email };
    const createdMember = { id: "member-1", userId: createdUser.id };

    prisma.$transaction.mockImplementation(async (callback: any) =>
      callback({
        user: {
          create: jest.fn().mockResolvedValue(createdUser),
        },
        member: {
          create: jest.fn().mockResolvedValue(createdMember),
        },
      })
    );
    inviteRepository.markAsUsed.mockResolvedValue(undefined);

    const useCase = makeUseCase();
    const result = await useCase.execute(token, dto);

    expect(passwordService.hash).toHaveBeenCalledWith(dto.password);
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(inviteRepository.markAsUsed).toHaveBeenCalledWith(
      token,
      expect.any(Date)
    );
    expect(result).toEqual(createdMember);
  });
});
