const { startServer, closeServer } = require("../server");
const { chaiRequest } = require("../src/utils/test-helper");

const authToken = process.env.AUTH_TOKEN;

describe("USER API", () => {
  let appServer;

  before(async () => {
    appServer = await startServer();
  });

  after(async () => {
    await closeServer(appServer.server);
  });

  describe("GET /api/v1/users", () => {
    it("should fetch all users' data", async () => {
      await chaiRequest(
        "get",
        "/api/v1/users",
        {},
        authToken
      );
    });
  });

  describe("GET /api/v1/users/:userId", () => {
    it("should fetch a single user data by Id", async () => {
      await chaiRequest(
        "get",
        "/api/v1/users/6550b18eef092baac714097f",
        {},
        authToken
      );
    });
  });

  describe("PUT /api/v1/users/:userId", () => {
    it("should update a user's details", async () => {
      const data = {
        username: "Barry2",
        email: "barry2@mainstack.com",
        password: "Barry2123!",
      };

      await chaiRequest(
        "put",
        "/api/v1/users/6550b18eef092baac714097f",
        data,
        authToken
      );
    });
  });

  describe("DELETE /api/v1/users/:userId", () => {
    it("should delete a user", async () => {
      await chaiRequest(
        "delete",
        "/api/v1/users/6550b18eef092baac714097f",
        {},
        authToken
      );
    });
  });
});
