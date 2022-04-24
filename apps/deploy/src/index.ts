import { App } from "aws-cdk-lib";
import { AppStack } from "./stacks/AppStack";
import { ExternalStack } from "./stacks/ExternalStack";

const app = new App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;

const external = new ExternalStack(app, "LambdaApiExperimentExternal", {
  env: {
    account,
    region,
  },
});

new AppStack(app, "LambdaApiExperimentApp", {
  env: {
    account,
    region,
  },
  external,
});
