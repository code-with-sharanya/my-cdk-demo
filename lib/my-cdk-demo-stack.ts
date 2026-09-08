import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';

export class MyCdkDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Create DynamoDB Table (The "Warehouse")
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
    // 2. Create Lambda Function (The "Brain")
    const handler = new lambda.Function(this, 'ApiHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });
    // 3. Grant Lambda permission to read/write DynamoDB
    table.grantReadWriteData(handler);
    // 4. Create API Gateway (The "Front Door")
    const api = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'My Serverless API',
    });
    // 5. Connect API Gateway to Lambda
    const items = api.root.addResource('items');
    const integration = new apigateway.LambdaIntegration(handler);
    items.addMethod('GET', integration);
    items.addMethod('POST', integration);
  }
}
