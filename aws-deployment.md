# Baddie Reseller - AWS Deployment Configuration

## CloudFormation Template

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Baddie Reseller Application Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [production, staging, development]

Resources:
  # S3 Bucket for static website hosting
  WebsiteBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub 'baddie-reseller-${Environment}-${AWS::AccountId}'
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html
      PublicAccessBlockConfiguration:
        BlockPublicAcls: false
        BlockPublicPolicy: false
        IgnorePublicAcls: false
        RestrictPublicBuckets: false

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt WebsiteBucket.DomainName
            Id: S3Origin
            S3OriginConfig:
              OriginAccessIdentity: ''
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods: [GET, HEAD, OPTIONS]
          CachedMethods: [GET, HEAD, OPTIONS]
          ForwardedValues:
            QueryString: false
            Cookies:
              Forward: none
        DefaultRootObject: index.html
        Enabled: true
        HttpVersion: http2
        PriceClass: PriceClass_100

Outputs:
  WebsiteURL:
    Description: 'Website URL'
    Value: !GetAtt CloudFrontDistribution.DomainName
  BucketName:
    Description: 'S3 Bucket Name'
    Value: !Ref WebsiteBucket
```

## Deployment Script

```bash
#!/bin/bash
# deploy-aws.sh

set -e

ENVIRONMENT=${1:-production}
STACK_NAME="baddie-reseller-${ENVIRONMENT}"
REGION=${AWS_REGION:-us-east-1}

echo "Deploying Baddie Reseller to AWS (${ENVIRONMENT})..."

# Build the application
npm run build

# Deploy CloudFormation stack
aws cloudformation deploy \
  --template-file aws-infrastructure.yml \
  --stack-name $STACK_NAME \
  --parameter-overrides Environment=$ENVIRONMENT \
  --region $REGION \
  --capabilities CAPABILITY_IAM

# Get S3 bucket name from stack outputs
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text)

# Sync build files to S3
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete

# Get CloudFront distribution ID and invalidate cache
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $REGION \
  --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment completed successfully!"
```

## Required AWS Permissions

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "cloudfront:*",
                "cloudformation:*",
                "iam:GetRole",
                "iam:CreateRole",
                "iam:AttachRolePolicy"
            ],
            "Resource": "*"
        }
    ]
}
```