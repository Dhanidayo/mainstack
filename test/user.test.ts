import * as chai from "chai";
import chaiHttp = require("chai-http");
import configureApp from "../src/app";
import { handleErrorResponse } from "../src/utils/test-helper";

const app = configureApp();

chai.use(chaiHttp);
const expect = chai.expect;

const authToken = process.env.AUTH_TOKEN;

describe("USER API", () => {
  describe("GET /api/v1/users", () => {
    it("should fetch all users' data", (done) => {
      const path = "/api/v1/users";
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
              expect(res.body.message).to.equal("Users fetched successfully");
              expect(res.body.data).to.be.an("array");
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("GET /api/v1/users/:userId", () => {
    it("should fetch a single user data by Id", (done) => {
      const path = "/api/v1/users/6550e01a7e002ea6ce1e0cbb";
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
              try {
                expect(res).to.have.status(200);
                expect(res).to.be.an("object");
                expect(res.body.message).to.equal("Success");
                expect(res.body.data).to.be.an("object");
              } catch (error) {
                handleErrorResponse(error, path);
              }
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("PUT /api/v1/users/:userId", () => {
    it("should update a user's details", (done) => {
      const path = "/api/v1/users/6550e01a7e002ea6ce1e0cbb";
      chai
        .request(app)
        .put(path)
        .send({
          username: "Barry2",
          email: "barry2@mainstack.com",
          password: "Barry2123!",
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
                "User info updated successfully"
              );
              expect(res.body.data).to.be.an("object");
            }
            done();
          }
        });
    }).timeout(30000);
  });

  describe("DELETE /api/v1/users/:userId", () => {
    it("should delete a user", async () => {
      const res = await chai
        .request(app)
        .delete("/api/v1/users/6550e01a7e002ea6ce1e0cbb")
        .set({ Authorization: `${authToken}` });

      if (res.body.error) {
        expect(res.status).to.satisfy((status: number) => {
          return [401, 404, 500].includes(status);
        });
      } else {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equal("User deleted successfully");
      }
    }).timeout(30000);
  });
});
