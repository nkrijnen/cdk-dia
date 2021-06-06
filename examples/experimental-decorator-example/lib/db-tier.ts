import * as rds from "@aws-cdk/aws-rds"
import * as cdk from "@aws-cdk/core"
import * as ec2 from "@aws-cdk/aws-ec2"

import { DiagramOptions, CollapseTypes, DiagramForceNonCollapsed, CdkDia, CdkDiaDecorator } from "cdk-dia"

export class Db extends rds.DatabaseCluster {
    constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc) {
        super(scope, id, dbProps(vpc));
    }
}

export class DbWithDiagramExplicitDecorator extends rds.DatabaseCluster implements cdk.IInspectable {
    constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc) {
        super(scope, id, dbProps(vpc));
    }

    inspect(inspector: cdk.TreeInspector): void {
        const decorator = new CdkDiaDecorator().collapse(CollapseTypes.FORCE_NON_COLLAPSE)
        CdkDia.decorate(inspector, decorator)
    }
}

@DiagramOptions({ collapse: CollapseTypes.FORCE_NON_COLLAPSE })
export class DbWithDiagramDecorator extends rds.DatabaseCluster {
    constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc) {
        super(scope, id, dbProps(vpc));
    }
}

@DiagramForceNonCollapsed
export class DbWithDiagramSimpleDecorator extends rds.DatabaseCluster {
    constructor(scope: cdk.Construct, id: string, vpc: ec2.Vpc) {
        super(scope, id, dbProps(vpc));
    }
}

function dbProps(vpc: ec2.Vpc): rds.DatabaseClusterProps {
    return {
        engine: rds.DatabaseClusterEngine.auroraMysql({ version: rds.AuroraMysqlEngineVersion.VER_2_08_1 }),
        credentials: rds.Credentials.fromGeneratedSecret('clusteradmin'),
        instanceProps: { vpc: vpc }
    }
}
