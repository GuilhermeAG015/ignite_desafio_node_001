import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('./task.csv', import.meta.url);

const BASE_URL = process.env.BASE_URL

const stream = fs.createReadStream(csvPath);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
});

async function importCsvTOServer() {
  const linesParse = stream.pipe(csvParse);

  for await (const chunk of linesParse) {
    const [title, description] = chunk;

    await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })
  }

}

importCsvTOServer()