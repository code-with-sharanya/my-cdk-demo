import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { MyCdkDemoStack } from './my-cdk-demo-stack';
// Create a Stage that wraps our Stack
class MyAppStage extends cdk.Stage {
    constructor(scope: Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);
        // Add our stack inside this stage
        new MyCdkDemoStack(this, 'MyCdkDemoStack', {
            env: props?.env
        });
    }
}
export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            pipelineName: 'MyApiPipeline',
            selfMutation: true,
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.gitHub(
                    'code-with-sharanya/my-cdk-demo',
                    'main'),
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth']
            })
        });
        // Now: Add the Stage (not the Stack directly)
        pipeline.addStage(new MyAppStage(this, 'DeployStage', {
            env: {
                account: '797664194321',
                region: 'ap-south-1'
            }
        }));
    }
}
