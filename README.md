## Description

This CDK (AWS Cloud Development Kit) project enables you to easily restore a MySQL Aurora Serverless instance from a backup snapshot on AWS and set up a Bastion Host to facilitate connecting to the database securely.

## Introduction

Restoring MySQL Aurora databases from snapshots is a common task when you need to recreate a database or recover data. This CDK project streamlines the process by providing a convenient and automated way to create a new MySQL Aurora instance from a specified snapshot. Additionally, it sets up a Bastion Host that acts as a secure gateway for accessing the database.

## Prerequisites

Before using this project, ensure you have the following prerequisites:

1.  **AWS Account and AWS CLI**: You'll need access to an AWS account to deploy the resources using CDK.
2.  **Node.js**: Ensure you have Node.js installed on your system.
3.  **AWS CDK Toolkit**: The CDK Command Line Interface

## Installation

To install and deploy the project, follow these steps:

1.  Clone the repository
2.  Install dependencies -> `npm install`

## **Configuration**

To configure the CDK project, you'll need to set the following environment variables:

- **ACCOUNT_ID**: Your AWS account ID.
- **REGION**: The AWS region where you want to deploy the resources.
- **STACK_NAME_SUFFIX**: A suffix to be appended to the CloudFormation stack name.
- **VPC_ID**: The ID of the VPC where you want to deploy the Aurora database and the Bastion Host. If not provided a new one will be created
- **SNAPSHOT_ARN**: The ARN of the Aurora snapshot you want to restore the database from.
- **PUBLIC_SUBNET_ID**: The ID of the public subnet where the Bastion Host will be launched.
- **PUBLIC_SUBNET_AZ**: The availability zone of the public subnet.
- **MY_IP**: The ip that will be withelisted in the Bastion Host security group.

Make sure to set these environment variables before proceeding with the deployment.

## Deploy

`cdk deploy`

After the deploy go to the AWS Console and then:

1.  Get the new Bastion Host IP
2.  Get the password from Secrets Manager
3.  Connect to your restored MySQL Aurora database
