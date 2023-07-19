import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStack } from '../lib/cdk-stack';
import * as dotenv from 'dotenv';
dotenv.config();

const app = new cdk.App();
new CdkStack(app, `RDS-snapshot-restore-${process.env.STACK_NAME_SUFFIX}`, {
  env: { account: process.env.ACCOUNT_ID, region: process.env.REGION },
});
