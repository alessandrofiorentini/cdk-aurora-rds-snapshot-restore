import * as cdk from 'aws-cdk-lib';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
  IVpc,
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  Subnet,
  SubnetType,
  Vpc,
} from 'aws-cdk-lib/aws-ec2';
import {
  AuroraCapacityUnit,
  DatabaseClusterEngine,
  ServerlessClusterFromSnapshot,
} from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { BastionHostForward } from './models/bastion-host-forward';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let vpc: IVpc;
    if (process.env.VPC_ID) {
      vpc = Vpc.fromLookup(this, 'Vpc', {
        vpcId: process.env.VPC_ID,
      });
    } else {
      vpc = new Vpc(this, `Vpc`, {
        natGateways: 1,
      });
    }

    const clusterSecurityGroup = new SecurityGroup(this, `SecurityGroup`, {
      securityGroupName: `${this.stackName}-ServerlessClusterSecurityGroup`,
      vpc: vpc,
      allowAllOutbound: true,
    });

    const cluster = new ServerlessClusterFromSnapshot(
      this,
      `ServerlessCluster`,
      {
        engine: DatabaseClusterEngine.AURORA_MYSQL,
        vpc,
        securityGroups: [clusterSecurityGroup],
        clusterIdentifier: `${this.stackName}-restored-cluster`,
        snapshotIdentifier: process.env.SNAPSHOT_ARN!,
        removalPolicy: RemovalPolicy.DESTROY,
        deletionProtection: false,
        credentials: {
          username: 'admin',
          generatePassword: true,
        },
        scaling: {
          autoPause: Duration.hours(1),
          minCapacity: AuroraCapacityUnit.ACU_1,
          maxCapacity: AuroraCapacityUnit.ACU_1,
        },
      }
    );

    //BASTION HOST
    const bastionHostSg = new SecurityGroup(this, 'BastionHostSecurityGroup', {
      securityGroupName: `${this.stackName}-BastionHostSecurityGroup`,
      vpc: vpc,
      allowAllOutbound: true,
    });

    bastionHostSg.addIngressRule(
      Peer.ipv4(`${process.env.MY_IP}/32`),
      Port.tcp(3306),
      'Allow MySQL access'
    );

    const subnetSelection = vpc?.selectSubnets(
      process.env.PUBLIC_SUBNET_ID && process.env.PUBLIC_SUBNET_AZ
        ? {
            subnets: [
              Subnet.fromSubnetAttributes(this, 'PublicSubnet', {
                subnetId: process.env.PUBLIC_SUBNET_ID,
                availabilityZone: process.env.PUBLIC_SUBNET_AZ,
              }),
            ],
          }
        : {
            subnetType: SubnetType.PUBLIC,
          }
    );

    new BastionHostForward(this, 'BastionHost', {
      name: `${this.stackName}-BastionHost`,
      address: cluster.clusterEndpoint.hostname,
      vpc,
      port: 3306,
      securityGroup: bastionHostSg,
      subnetSelection: subnetSelection,
      instanceType: InstanceType.of(
        InstanceClass.BURSTABLE2,
        InstanceSize.MICRO
      ),
    });

    clusterSecurityGroup.connections.allowFrom(bastionHostSg, Port.tcp(3306));
  }
}
