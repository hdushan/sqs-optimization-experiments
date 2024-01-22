export const handler = async (event: { Records: any[]; }) => {
    let i: number = 0
    event.Records.forEach(async (record: any) => {
        i = i + 1
        console.log(`Processing START event #${i}: ${JSON.stringify(record, undefined, 2)}`)
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log(`Processing END event #${i}: ${JSON.stringify(record, undefined, 2)}`)
    })
}