import { check, sleep } from 'k6';
import { AWSConfig, SQSClient } from 'https://jslib.k6.io/aws/0.11.0/sqs.js'

export const options = {
    stages: [
      { duration: '10s', target: 10 },
      { duration: '10s', target: 10 },
      { duration: '10s', target: 0 },
    ],
}

const awsConfig = new AWSConfig({
    region: __ENV.AWS_REGION,
    accessKeyId: __ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: __ENV.AWS_SECRET_ACCESS_KEY,
})

const sqs = new SQSClient(awsConfig)
const queUrl = 'https://sqs.ap-southeast-2.amazonaws.com/587579738241/SqsOptimizationExperimentsStack-Queue'

export default async function () {
    // If our test queue does not exist, abort the execution.
    // const queuesResponse = await sqs.listQueues()
    // if (queuesResponse.queueUrls.filter((q) => q === queUrl).length == 0) {
    //     exec.test.abort()
    // }

    await sqs.sendMessage(queUrl, JSON.stringify({value: '123'}))
    sleep(0.5)
}
