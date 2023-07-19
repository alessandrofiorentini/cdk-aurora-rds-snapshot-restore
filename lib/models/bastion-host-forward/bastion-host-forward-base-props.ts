import * as ec2 from 'aws-cdk-lib/aws-ec2';

export interface BastionHostForwardBaseProps extends ec2.BastionHostLinuxProps {
  /**
   * The Vpc in which to instantiate the Bastion Host
   */
  readonly vpc: ec2.IVpc;

  /**
   * The name of the bastionHost instance
   *
   * @default "BastionHost"
   */
  readonly name?: string;

  /**
   * The security group, which is attached to the bastion host.
   *
   * @default If none is provided a default security group is attached, which
   * doesn't allow incoming traffic and allows outbound traffic to everywhere
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The HAProxy client timeout in minutes
   *
   * @default 1
   */
  readonly clientTimeout?: number;
}