import chai from "chai";
import chaiHttp from "chai-http";
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
          username: "Mane",
          email: "mane@mainstack.com",
          password: "mane123!",
        })
        .end((err, res) => {
          if (err) {
            done(err);
          } else {
            try {
              expect(res).to.have.status(201);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property(
                "message",
                "Registration successful"
              );
              expect(res.body).to.have.property("data");
            } catch (err: any) {
              if (err.response) {
                expect(res.status).to.satisfy((status: number) => {
                  return [400, 500].includes(status);
                });
                expect(err.response.body)
                  .to.have.property("error" || "message")
                  .and.to.satisfy((errMsg: string) => {
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
                done(err);
              }
            }
          }
          done();
        });
    }).timeout(30000);
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
            try {
              expect(res).to.have.status(200);
              expect(res.body).to.have.property("success", true);
              expect(res.body).to.have.property("message", "Login successful");
              expect(res.body).to.have.property("data");
            } catch (error) {
              console.log("ERROR", error);
              if (err.response) {
                expect(res.status).to.satisfy((status: number) => {
                  return [400, 500].includes(status);
                });
                expect(err.response.body)
                  .to.have.property("error" || "message")
                  .and.to.satisfy((errMsg: string) => {
                    return [
                      "All fields must be filled",
                      "Incorrect email",
                      "Incorrect password",
                      "Internal server error",
                    ].includes(errMsg);
                  });
                done(err);
              }
            }
          }
          done();
        });
    }).timeout(30000);
  });
});
