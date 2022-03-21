/* eslint-disable no-console,no-await-in-loop */
import humps from 'humps';
import { readdir, appendFile, unlink } from 'fs/promises';
import { createWorker } from 'tesseract.js';
import minimist from 'minimist';

// Handle cli params
const args = minimist(process.argv.slice(2));
const { namespace } = humps.camelizeKeys(args);
const snapshotsPath = `./snapshots/${namespace}`;


const noteDataToFile = async (target, data) => {
  const targetFile = `./benchmarks/${namespace}.${target}.txt`;
  await appendFile(targetFile, data, { flag: 'a', encoding: 'utf-8' });
};

const extractText = async (file) => {
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(`${snapshotsPath}/${file}`, 'eng');
    await worker.terminate();
    return text;
  } catch (error) {
    console.log(error);
  }
  await worker.terminate();
  return '';
};

const processFile = async (file) => {
  const text = await extractText(file);
  if (file.startsWith('dashboard')) {
    await noteDataToFile('dashboard', text);
  } else {
    await noteDataToFile('task-manager', text);
  }
};

/*
 Handle images in batch, 4 should be fine,
 Increase this number may cause the process to stuck at some point when running for too long
 Weak computer may need lower value
 */
const batch = 4;

(async () => {
  const files = await readdir(snapshotsPath);
  const t0 = performance.now();

  let currentIndex = 0;
  for (const index in files) {
    if (currentIndex >= files.length) break;

    const filesSlice = files.slice(currentIndex, (currentIndex + batch) >= files.length ? files.length : (currentIndex + batch));
    await Promise.all(filesSlice.map(((file) => processFile(file))));
    currentIndex += batch;

    try {
      // Remove generated traineddata because it's broken and affect subsequent runs
      await unlink('./eng.traineddata');
    } catch (error) {
      console.log(error);
    }
    // await noteDataToFile('batches', `\nHandle batch done:\n${JSON.stringify(filesSlice)}`);
  }
  const t1 = performance.now();
  console.log(`Extracting texts took ${(t1 - t0) / 1000} seconds.`);
})();
