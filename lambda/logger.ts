const axios = require("axios");

async function get_joke() {
  const url = "https://official-joke-api.appspot.com/random_joke";
  const resp = await axios.get(url);
  return resp;
}

export const handler = async (event: { Records: any[] }, context: any) => {
  console.log(`Number of records in event: ${event.Records.length}`);
  const batchItemFailures: { ItemIdentifier: any }[] = [];

  const promises = event.Records.map(async (record, index) => {
    try {
      const resp = await get_joke();
      console.log(`Joke ${index}: ${resp.data.setup} : ${resp.data.punchline}`);
      if ((index + 1) % 3 == 0) {
        throw `Intentional Error for record #${index}, messageId ${record.messageId}`;
      }
    } catch (error) {
      console.log(error);
      batchItemFailures.push({ ItemIdentifier: record.messageId });
    }
  });
  await Promise.allSettled(promises);

  console.log("batchItemFailures");
  console.log(batchItemFailures);
  return {
    batchItemFailures,
  };
};
