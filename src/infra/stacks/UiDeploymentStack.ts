import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../utils";
import { join } from "path";
import { existsSync } from "fs";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { AccessLevel, Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3BucketOrigin } from "aws-cdk-lib/aws-cloudfront-origins";

export class UiDeploymentStack extends Stack {

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
        const suffix = getSuffixFromStack(this);
    
        const deploymentBucket = new Bucket(this, 'uiDeploymentBucket', {
            bucketName: `test-project-frontend-${suffix}`
        });

        const uiDirectory = join(__dirname, '..', '..', '..', '..', 'test-project-frontend', 'dist');

        if(!existsSync(uiDirectory)){
            console.warn('UI Directory Not Found', uiDirectory);
            return;
        }

        new BucketDeployment(this, 'TestProjectDeployment', {
            destinationBucket: deploymentBucket,
            sources: [Source.asset(uiDirectory)]
        });

        const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
            originAccessLevels: [AccessLevel.READ]
        });

        const distribution = new Distribution(this, 'TestProjectDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: s3Origin
            }
        });

        new CfnOutput(this, 'TestProjectUrl', {
            value: distribution.distributionDomainName
        })
    }

}