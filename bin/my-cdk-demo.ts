#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from '../lib/pipeline-stack';

const app = new cdk.App();
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: '797664194321',
    region: 'ap-south-1'
  }
});