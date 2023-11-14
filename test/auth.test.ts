import chai from "chai";
import chaiHttp from "chai-http";
import { startServer, closeServer } from "../server";
import configureApp from "../src/app";

const app = configureApp();

const { expect } = chai;

chai.use(chaiHttp);

describe("AUTH API", () => {
  describe("POST /api/v1/auth/register", () => {
    it("should handle user registration", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "Rose",
          email: "rose@mainstack.com",
          password: "Rose123!",
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              expect(res.status).to.satisfy((status: number) => {
                return [400, 500].includes(status);
              });
              expect(res.body.error).to.satisfy((errMsg: string) => {
                return [
                  "All fields must be filled",
                  "Username is too short",
                  "Invalid email",
                  "Password is not strong enough",
                  "Email has already been registered",
                  "Error hashing password",
                  "Unexpected error during password hashing",
                  "Internal server error",
                ].includes(errMsg);
              });
            } else {
              expect(res).to.have.status(201);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property(
                "message",
                "Registration successful"
              );
              expect(res.body).to.have.property("data");
            }
          }
          done();
        });
    }).timeout(20000);
  });

  describe("POST /api/v1/auth/login", () => {
    it("should handle user login", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({ email: "tarry@mainstack.com", password: "tarry123!" })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            if (res.body.error) {
              expect(res.status).to.satisfy((status: number) => {
                return [400, 500].includes(status);
              });

              expect(res.body.error).to.satisfy((errMsg: string) => {
                return [
                  "All fields must be filled",
                  "Incorrect email",
                  "Incorrect password",
                  "Internal server error",
                ].includes(errMsg);
              });
            } else {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property("message", "Login successful");
              expect(res.body).to.have.property("data");
            }
          }
          done();
        });
    }).timeout(20000);
  });
});
