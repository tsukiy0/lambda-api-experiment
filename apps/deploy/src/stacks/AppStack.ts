import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ExternalStack } from "./ExternalStack";
import { Api } from "../constructs/Api";

export class AppStack extends Stack {
  public constructor(
    scope: Construct,
    id: string,
    props: StackProps & {
      external: ExternalStack;
    }
  ) {
    super(scope, id, props);

    new Api(this, "Api");
  }
}
