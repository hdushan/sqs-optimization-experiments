const axios = require("axios");

async function get_joke() {
  const url = "https://official-joke-api.appspot.com/random_joke";
  const resp = await axios.get(url);
  return resp;
}

export const handler = async (event: { Records: any[] }, context: any) => {
  console.log(`Number of records in event: ${event.Records.length}`);
  let i: number = 0;
  const batchItemFailures = [];

  for (const record of event.Records) {
    i = i + 1;
    try {
      const resp = await get_joke();
      console.log(`Joke ${i}: ${resp.data.setup} : ${resp.data.punchline}`);
      if (i % 3 == 0) {
        throw `Intentional Error for record #${i}, messageId ${record.messageId}`;
      }
    } catch (error) {
      console.log(error);
      batchItemFailures.push({ ItemIdentifier: record.messageId });
    }
  }

  console.log("batchItemFailures");
  console.log(batchItemFailures);
  return {
    batchItemFailures,
  };
};
