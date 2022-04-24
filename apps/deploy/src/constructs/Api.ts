import {
  Code,
  FunctionUrl,
  FunctionUrlAuthType,
  HttpMethod,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { Function } from "aws-cdk-lib/aws-lambda";
import path from "path";
import { Duration } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Cors } from "aws-cdk-lib/aws-apigateway";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import {
  CorsHttpMethod,
  HttpApi,
  PayloadFormatVersion,
} from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

export class Api extends Construct {
  public constructor(scope: Construct, id: string) {
    super(scope, id);

    const fn = new Function(this, "Function", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(path.resolve(__dirname, "../../../api/dist")),
      handler: "index.handler",
      memorySize: 128,
      retryAttempts: 0,
      timeout: Duration.seconds(30),
      logRetention: RetentionDays.ONE_DAY,
    });

    const fnUrl = new FunctionUrl(this, "FunctionUrl", {
      function: fn,
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedMethods: [HttpMethod.ALL],
        allowedOrigins: Cors.ALL_ORIGINS,
      },
    });

    const httpApi = new HttpApi(this, "HttpApi", {
      defaultIntegration: new HttpLambdaIntegration("DefaultIntegration", fn, {
        payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      }),
      corsPreflight: {
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: Cors.ALL_ORIGINS,
      },
    });

    new StringParameter(this, "FunctionUrlParam", {
      parameterName: "/function/url",
      stringValue: fnUrl.url,
    });

    new StringParameter(this, "HttpApiUrlParam", {
      parameterName: "function/httpapi/url",
      stringValue: httpApi.url!,
    });
  }
}
