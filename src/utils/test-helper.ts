import * as chai from "chai";
import chaiHttp from "chai-http";
import configureApp from "../app";

const app = configureApp();

const { expect } = chai;

chai.use(chaiHttp);

export const handle404ErrorResponse = (path: string, body: { error: any }) => {
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

export const handleErrorResponse = (err: any, path: any) => {  
  if (err) {
    const { status, body } = err;

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
  }
};
