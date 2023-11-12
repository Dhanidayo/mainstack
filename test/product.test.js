const { startServer, closeServer } = require("../server");
const { chaiRequest } = require("../src/utils/test-helper");

const authToken = process.env.AUTH_TOKEN;

describe("PRODUCT API", () => {
  let appServer;

  before(async () => {
    appServer = await startServer();
  });

  after(async () => {
    await closeServer(appServer.server);
  });

  describe("POST /api/v1/products/create", () => {
    it("should create a new product", async () => {
      await chaiRequest(
        "post",
        "/api/v1/products/create",
        {
          name: "Product",
          description: "Product description",
          brand: "Product brand",
          price: 120,
          category: "other",
          stock: 500,
          imageUrl: "",
        },
        authToken
      );
    });
  });

  describe("GET /api/v1/products/all", () => {
    it("should fetch all products", async () => {
      await chaiRequest("get", "/api/v1/products/all", {}, authToken, {
        successMessage: "All Products fetched successfully",
      });
    });
  });

  describe("GET /api/v1/products/user/all", () => {
    it("should fetch all products belonging to a user", async () => {
      await chaiRequest(
        "get",
        "/api/v1/products/user/all",
        {},
        authToken
      );
    });
  });

  describe("GET /api/v1/products/", () => {
    it("should fetch products by name", async () => {
      const path = "/api/v1/products?name=Jacket";
      await chaiRequest("get", path, {}, authToken);
    });
  });

  describe("GET /api/v1/products/:productId", () => {
    it("should fetch a single product by Id", async () => {
      const path = "/api/v1/products/6550e01a7e002ea6ce1e0cbb";
      await chaiRequest("get", path, {}, authToken);
    });
  });

  describe("PUT /api/v1/products/:productId", () => {
    it("should update a product's details", async () => {
      const path = "/api/v1/products/6550e01a7e002ea6ce1e0cbb";
      await chaiRequest(
        "put",
        path,
        {
          name: "Updated Product",
          description: "Updated Product description",
          brand: "Updated Product brand",
          price: 120,
          category: "other",
          stock: 500,
          imageUrl: "",
        },
        authToken
      );
    });
  });

  describe("DELETE /api/v1/products/:productId", () => {
    it("should delete a product", async () => {
      const path = "/api/v1/products/6550e01a7e002ea6ce1e0cbb";
      await chaiRequest("delete", path, {}, authToken);
    });
  });
});
