import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { MyCdkDemoStack } from './my-cdk-demo-stack';

export class PipelineStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
            pipelineName: 'MyApiPipeline',
            selfMutation: true,
            synth: new pipelines.ShellStep('Synth', {
                input: pipelines.CodePipelineSource.gitHub(
                    'code-with-sharanya/my-cdk-demo',  // Your GitHub username/repo
                    'main'
                ),
                commands: [
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            })
        });

        pipeline.addStage(new MyCdkDemoStack(this, 'DeployStage', {
            env: {
                account: '797664194321',      // Your AWS Account ID
                region: 'ap-south-1'          // Your AWS Region
            }
        }));
    }
}
