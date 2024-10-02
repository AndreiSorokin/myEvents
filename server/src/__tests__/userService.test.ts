import sinon from "sinon";
import { expect } from "@jest/globals";
import userService from "../services/userService";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { userData } from "./helper/userHelper";

// Mock User object
const mockUser = {
  ...userData,
  save: sinon.stub().resolves(this),
};

describe("UserService", () => {
  let findOneStub: sinon.SinonStub;
  let findByIdStub: sinon.SinonStub;
  let bcryptHashStub: sinon.SinonStub;

  // Reset the stubs before each test
  beforeEach(() => {
    findOneStub = sinon.stub(UserModel, "findOne");
    findByIdStub = sinon.stub(UserModel, "findById");
    bcryptHashStub = sinon.stub(bcrypt, "hash");
  });

  afterEach(() => {
    sinon.restore(); // Reset all sinon stubs and mocks
  });

  describe("createUser", () => {
    it("should create a new user if the email is not already in use", async () => {
      // Set up the test to simulate no existing user
      findOneStub.resolves(null);
      const userSaveStub = sinon
        .stub(UserModel.prototype, "save")
        .resolves(mockUser);

      const result = await userService.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(findOneStub.calledOnce).toBeTruthy();
      expect(userSaveStub.calledOnce).toBeTruthy();
    });

    it("should throw a BadRequestError if the email is already in use", async () => {
      // Set up the test to simulate an existing user
      findOneStub.resolves(mockUser);

      await expect(userService.createUser(userData)).rejects.toThrow(
        BadRequestError
      );
      expect(findOneStub.calledOnce).toBeTruthy();
    });
  });

  describe("updateUserPassword", () => {
    it("should update the user's password when valid", async () => {
      findByIdStub.resolves(mockUser);
      bcryptHashStub.resolves("hashedPassword123");

      const result = await userService.updateUserPassword(
        "someId",
        "OldPassword123",
        "NewPassword123!"
      );

      expect(result.password).toEqual("hashedPassword123");
      expect(findByIdStub.calledOnce).toBeTruthy();
      expect(bcryptHashStub.calledOnce).toBeTruthy();
    });

    it("should throw NotFoundError if the user is not found", async () => {
      findByIdStub.resolves(null);

      await expect(
        userService.updateUserPassword(
          "invalidId",
          "OldPassword123",
          "NewPassword123!"
        )
      ).rejects.toThrow(NotFoundError);
      expect(findByIdStub.calledOnce).toBeTruthy();
    });

    it("should throw BadRequestError if new or current passwords are missing", async () => {
      findByIdStub.resolves(mockUser);

      await expect(
        userService.updateUserPassword("someId", "", "NewPassword123!")
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("findUserById", () => {
    it("should return the user if found", async () => {
      findByIdStub.resolves(mockUser);

      const result = await userService.findUserById("someId");

      expect(result).toEqual(mockUser);
      expect(findByIdStub.calledOnce).toBeTruthy();
    });

    it("should throw NotFoundError if the user is not found", async () => {
      findByIdStub.resolves(null);

      await expect(userService.findUserById("invalidId")).rejects.toThrow(
        NotFoundError
      );
      expect(findByIdStub.calledOnce).toBeTruthy();
    });
  });
});
