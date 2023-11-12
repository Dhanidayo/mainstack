const chai = require("chai");
const chaiHttp = require("chai-http");
const { startServer, closeServer } = require("../server");
const configureApp = require("../src/app");
const app = configureApp();

const { expect } = chai;

chai.use(chaiHttp);

describe("AUTH API", () => {
  let appServer;

  before(async () => {
    appServer = await startServer();
  });

  after(async () => {
    await closeServer(appServer.server);
  });

  describe("POST /api/v1/auth/register", () => {
    it("should handle user registration", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/register")
        .send({
          username: "Barry",
          email: "barry@mainstack.com",
          password: "Barry123!",
        })
        .end((err, res) => {
          if (err) {
            console.error("Response Status Code:", err.response.status);
            console.error("Response Body:", err.response.body);

            expect(err.response).to.have.status(400).or.have.status(500);
            expect(err.response.body)
              .to.have.property("error")
              .and.to.satisfy((errMsg) => {
                return [
                  "All fields must be filled",
                  "Username is too short",
                  "Invalid email",
                  "Password is not strong enough",
                  "Email has already been registered",
                  "Error hashing password",
                  "Error during password hashing",
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
          done();
        });
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should handle user login", (done) => {
      chai
        .request(app)
        .post("/api/v1/auth/login")
        .send({ email: "tarry@mainstack.com", password: "tarry123!" })
        .end((err, res) => {
          if (err) {
            expect(err.response).to.have.status(400).or.have.status(500);
            expect(err.response.body)
              .to.have.property("error")
              .and.to.satisfy((errMsg) => {
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
          done();
        });
    });
  });
});
