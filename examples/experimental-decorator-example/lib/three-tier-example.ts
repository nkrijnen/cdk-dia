import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as rds from "@aws-cdk/aws-rds";
import * as lb from "@aws-cdk/aws-elasticloadbalancingv2";
import * as lb_targets from "@aws-cdk/aws-elasticloadbalancingv2-targets";

import {WebTier} from "./web-tier"

export class ThreeTierExample extends cdk.Stack {

    constructor(scope: cdk.Construct, id: string, dbConstructor: new (context: cdk.Stack, name: string, arg2: ec2.Vpc) => rds.DatabaseCluster) {
        super(scope, id);

        const vpc = new ec2.Vpc(this, "Vpc");
        const alb = new lb.ApplicationLoadBalancer(this, "Loadbalancer", {vpc: vpc})

        const webTier = new WebTier(this, 'WebTier', vpc)

        const cluster = new dbConstructor(this, 'DbTier', vpc)

        webTier.instances.forEach(instance => {
            cluster.secret?.grantWrite(instance)
        })

        const applicationListener = alb.addListener("443", {port: 80})

        applicationListener.addTargets("lb-targets", {
            port: 80,
            targets: webTier.instances.map(instance => {
                return new lb_targets.InstanceTarget(instance, 80)
            })
        })
    }
}
