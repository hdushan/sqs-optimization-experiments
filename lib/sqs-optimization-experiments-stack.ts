import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as sqs from 'aws-cdk-lib/aws-sqs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import lambdaEventSources = require('aws-cdk-lib/aws-lambda-event-sources')

export class SqsOptimizationExperimentsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const dlq = new sqs.Queue(this, 'SqsOptimizationExperimentsDLQ', {
      queueName: 'SqsOptimizationExperimentsStack-Dlq',
      visibilityTimeout: cdk.Duration.seconds(45)
    })

    const queue = new sqs.Queue(this, 'SqsOptimizationExperimentsQueue', {
      queueName: 'SqsOptimizationExperimentsStack-Queue',
      visibilityTimeout: cdk.Duration.seconds(45),
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 2,
      },
    })

    const logger_lambda = new lambda.Function(this, 'SqsOptimizationExperimentsLambda', {
      functionName: 'SqsOptimizationExperimentsStack-Lambda',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'logger.handler',
      timeout: cdk.Duration.seconds(10),
      tracing: lambda.Tracing.ACTIVE
    })

    const eventSource = new lambdaEventSources.SqsEventSource(queue, {
      batchSize: 10,
      maxBatchingWindow: cdk.Duration.seconds(5),
      reportBatchItemFailures: true
    })
    logger_lambda.addEventSource(eventSource)

    const stack = cdk.Stack.of(this)

    new cdk.CfnOutput(this, 'QueueUrl', {
      exportName: `${stack.stackName}-QueueUrl`,
      value: queue.queueUrl,
    })

    new cdk.CfnOutput(this, 'QueueArn', {
      exportName: `${stack.stackName}-QueueArn`,
      value: queue.queueArn,
    })

    new cdk.CfnOutput(this, 'DlqUrl', {
      exportName: `${stack.stackName}-DlqUrl`,
      value: dlq.queueUrl,
    })

    new cdk.CfnOutput(this, 'DlqArn', {
      exportName: `${stack.stackName}-DlqArn`,
      value: dlq.queueArn,
    })
  }
}
