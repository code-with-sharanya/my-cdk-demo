import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class BootstrapStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // This is a dummy resource that does nothing
        // It just forces the CDK bootstrap to run
    }
}