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

  // Reset the stubs before each test
  beforeEach(() => {
    findOneStub = sinon.stub(UserModel, "findOne");
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

  describe("UserService - updateUserPassword", () => {
    let findByIdStub: sinon.SinonStub;
    let bcryptHashStub: sinon.SinonStub;
    let mockUserSaveStub: sinon.SinonStub;

    const mockUser = {
      _id: "66f810ce766adcd06ab40c12",
      name: "John Doe",
      email: "john@example.com",
      password: "OldPassword123",
      save: sinon.stub(), // Mocks the save method
    };

    beforeEach(() => {
      findByIdStub = sinon.stub(UserModel, "findById").resolves(mockUser);
      bcryptHashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword123");
      mockUserSaveStub = mockUser.save.resolves(mockUser);
    });

    afterEach(() => {
      sinon.restore(); // Restore the stubbed methods
    });

    it("should update the user's password when valid", async () => {
      const result = await userService.updateUserPassword(
        "66f810ce766adcd06ab40c12",
        "OldPassword123",
        "NewPassword123!"
      );

      // The password should have been updated to the hashed password
      expect(result.password).toEqual("hashedPassword123");
      expect(findByIdStub.calledOnce).toBeTruthy();
      expect(bcryptHashStub.calledOnce).toBeTruthy();
      expect(mockUserSaveStub.calledOnce).toBeTruthy();
    });
  });

  // add test for user find by id
});
