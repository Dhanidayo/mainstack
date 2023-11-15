import * as chai from "chai";
import chaiHttp = require("chai-http");
import configureApp from "../src/app";
import { handleErrorResponse } from "../src/utils/test-helper";

const app = configureApp();

chai.use(chaiHttp);
const expect = chai.expect;

const authToken = process.env.AUTH_TOKEN;

describe("PRODUCT API", () => {
  describe("POST /api/v1/products/create", () => {
    it("should create a new product", (done) => {
      const path = "/api/v1/products/create";
      chai
        .request(app)
        .post(path)
        .send({
          name: "Product",
          description: "Product description",
          brand: "Product brand",
          price: 120,
          category: "other",
          stock: 500,
          imageUrl: "",
        })
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(201);
              expect(res.body.message).to.equal("Product created successfully");
              expect(res.body.data).to.be.an("object");
            }
          }
          done();
        });
    }).timeout(30000);
  });

  describe("GET /api/v1/products/all", () => {
    it("should fetch all products", (done) => {
      const path = "/api/v1/products/all";
      chai
        .request(app)
        .get(path)
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(200);
              expect(res).to.be.an("object");
              expect(res.body.message).to.equal(
                "All Products fetched successfully"
              );
              expect(res.body.data).to.be.an("array");
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("GET /api/v1/products/user/all", () => {
    it("should fetch all products belonging to a user", (done) => {
      const path = "/api/v1/products/user/all";
      chai
        .request(app)
        .get(path)
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(200);
              expect(res).to.be.an("object");
              expect(res.body.message).to.equal("Success");
              expect(res.body.data).to.be.an("object");
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("GET /api/v1/products/", () => {
    it("should fetch products by name", (done) => {
      const path = "/api/v1/products?name=Jacket";
      chai
        .request(app)
        .get(path)
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(200);
              expect(res).to.be.an("object");
              expect(res.body.message).to.equal("Success");
            }
          }
          done();
        });
    }).timeout(30000);
  });

  describe("GET /api/v1/products/:productId", () => {
    it("should fetch a single product by Id", (done) => {
      const path = "/api/v1/products/PRD97198";
      chai
        .request(app)
        .get(path)
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(200);
              expect(res).to.be.an("object");
              expect(res.body.message).to.equal("Success");
              expect(res.body.data).to.be.an("object");
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("PUT /api/v1/products/:productId", () => {
    it("should update a product's details", (done) => {
      const path = "/api/v1/products/PRD97198";
      chai
        .request(app)
        .put(path)
        .send({
          name: "New Product Riz",
          description: "",
          brand: "",
          price: 90,
          category: "other",
          stock: "",
          imageUrl: "",
        })
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(200);
              expect(res.body.message).to.equal(
                "Product details updated successfully"
              );
              expect(res.body.data).to.be.an("object");
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("DELETE /api/v1/products/:productId", () => {
    it("should delete a product", (done) => {
      const path = "/api/v1/products/PRD97198";
      chai
        .request(app)
        .delete(path)
        .set({ Authorization: `${authToken}` })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              handleErrorResponse(res, path);
            } else {
              expect(res).to.have.status(200);
            }
            done();
          }
        });
    }).timeout(30000);
  });
});
