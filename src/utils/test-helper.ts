import * as chai from "chai";
import chaiHttp from "chai-http";
import configureApp from "../app";
import { Express } from 'express';
import { CustomAgent } from "db/interfaces/customAgent";

const app = configureApp();

const { expect } = chai;

chai.use(chaiHttp);

const agent: CustomAgent = chaiHttp.agent as CustomAgent;

export const chaiRequest = async (
  method: string,
  path: string,
  data = {},
  authToken: string | undefined,
  assertions: {
    entity: any; successMessage?: any;
  } = {
    entity: undefined
  }
) => {
  try {
    const agent = createAgent(app);
    const res = await agent.sendRequest(method, path, authToken, data);

    expect(res).to.have.status(200);
    expect(res).to.be.an('object');

    switch (method) {
      case 'delete':
        expect(res.body.message).to.equal(
          assertions.successMessage ||
          `${assertions.entity} deleted successfully`
        );
        break;
      case 'put':
        handlePutAssertions(path, res, assertions);
        break;
      case 'get':
        handleGetAssertions(path, res);
        break;
      case 'post':
        expect(res.body.message).to.equal(
          assertions.successMessage ||
          `${assertions.entity} created successfully`
        );
        expect(res.body.data).to.be.an('object');
        break;
      default:
        throw new Error('Unexpected method');
    }
  } catch (err) {
    handleErrorResponse(err, path);
  }
};

const createAgent = (app: Express) => {
  const customAgent = agent(app) as unknown as CustomAgent;

  return {
    sendRequest: async (method: string, path: string, authToken?: string, data?: any) => {
      const request = customAgent[method](path);

      if (authToken) {
        request.set('Authorization', authToken);
      }

      if (method === 'put' || method === 'post') {
        request.send(data);
      }

      return await request;
    },
  };
};

const handlePutAssertions = (path: string, res: { body: { message: any; }; }, assertions: { successMessage?: any; }) => {
  if (path === "/api/v1/users/:userId") {
    expect(res.body.message).to.equal(
      assertions.successMessage || "User info updated successfully"
    );
  } else if (path === "/api/v1/products/:productId") {
    expect(res.body.message).to.equal(
      assertions.successMessage || "Product details updated successfully"
    );
  } else {
    throw new Error("Unexpected path for PUT request");
  }
};

const handleGetAssertions = (path: string, res: { body: { message: any; data: any; }; }) => {
  switch (path) {
    case "/api/v1/users/:userId":
      expect(res.body.message).to.equal("Success");
      expect(res.body.data).to.be.an("object");
      break;
    case "/api/v1/users":
      expect(res.body.message).to.equal("Users fetched successfully");
      expect(res.body.data).to.be.an("array");
      break;
    case "/api/v1/products":
      expect(res.body.message).to.equal("Success");
      expect(res.body.data).to.be.an("object");
      break;
    case "/api/v1/products/all":
      expect(res.body.message).to.equal("All Products fetched successfully");
      expect(res.body.data).to.be.an("array");
      break;
    case "/api/v1/products/user/all":
      expect(res.body.message).to.equal("Success");
      expect(res.body.data).to.be.an("object");
      break;
    case "/api/v1/products/:productId":
      expect(res.body.message).to.equal("Success");
      break;
    default:
      throw new Error("Unexpected path");
  }
};

const handle404ErrorResponse = (path: string, body: { error: any; }) => {
  switch (path) {
    case "/api/v1/users":
      expect(body.error).to.equal("No users found");
      break;
    case "/api/v1/users/:userId":
      expect(body.error).to.satisfy((errMsg: string) =>
        ["No user found", "Unknown User Id", "No such user"].includes(errMsg)
      );
      break;
    case "/api/v1/products/all":
      expect(body.error).to.equal("No products found");
      break;
    case "/api/v1/products/user/all":
      expect(body.error).to.equal("No products found for user");
      break;
    case "/api/v1/products":
      expect(body.error).to.equal("No product(s) match the given name");
      break;
    case "/api/v1/products/:productId":
      expect(body.error).to.satisfy((errMsg: string) =>
        ["No product found", "Unknown product Id", "No such product"].includes(
          errMsg
        )
      );
      break;
    default:
      throw new Error("Unexpected path");
  }
};

const handleErrorResponse = (err: any, path: any) => {
  if (err.response) {
    const { status, body } = err.response;

    switch (status) {
      case 401:
        expect(body.error).to.satisfy((errMsg: string) =>
          [
            "Authorization token required",
            "Unrecognized user. Please register/login to continue.",
            "Request is not authorized",
          ].includes(errMsg)
        );
        break;
      case 400:
        expect(body.error).to.satisfy((errMsg: string) =>
          [
            "Validation error",
            "Product already exists. Update stock count on product details.",
          ].includes(errMsg)
        );
        break;
      case 404:
        handle404ErrorResponse(path, body);
        break;
      case 500:
        expect(body.message).to.equal("Internal server error");
        break;
      default:
        throw new Error("Unexpected status code");
    }
    done(err);
  }
};
