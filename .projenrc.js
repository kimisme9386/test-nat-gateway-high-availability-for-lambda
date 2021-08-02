const { AwsCdkTypeScriptApp } = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.116.0',
  defaultReleaseBranch: 'main',
  name: 'test-nat-gateway-high-available',
  cdkDependencies: ['@aws-cdk/aws-ec2', '@aws-cdk/aws-lambda'],
  releaseWorkflow: false,
  context: {
    'availability-zones:account=482631629698:region=ap-northeast-1': [
      'ap-northeast-1a',
      'ap-northeast-1c',
    ],
  },
});
project.synth();
