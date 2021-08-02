import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Construct, Stack, StackProps } from '@aws-cdk/core';

export class TestNatGatewayHAStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const subnetConfiguration = [
      {
        cidrMask: 24,
        name: 'ingress',
        subnetType: ec2.SubnetType.PUBLIC,
      },
    ];

    subnetConfiguration.push({
      cidrMask: 24,
      name: 'application',
      subnetType: ec2.SubnetType.PRIVATE,
    });

    const vpc = new ec2.Vpc(this, 'Vpc', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      natGateways: 2,
      subnetConfiguration: subnetConfiguration,
    });

    new lambda.DockerImageFunction(this, 'CodepipelineEventLambda', {
      code: lambda.DockerImageCode.fromImageAsset(
        path.join(__dirname, '../lambda'),
        {
          cmd: ['app.handler'],
        },
      ),
      vpc,
      vpcSubnets: vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE,
      }),
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new TestNatGatewayHAStack(app, 'TestNatGatewayHAStack', { env: devEnv });

app.synth();
