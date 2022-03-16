/* eslint-disable no-console,no-await-in-loop */
import { readdir, appendFile, unlink } from 'fs/promises';
import { createWorker } from 'tesseract.js';

const snapshotsPath = './snapshots';

const noteDataToFile = async (target, data) => {
  const targetFile = `./${target}.txt`;
  await appendFile(targetFile, data, { flag: 'a', encoding: 'utf-8' });
};

const extractText = async (file) => {
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize(`${snapshotsPath}/${file}`, 'eng');
  await worker.terminate();
  return text;
};

const processFile = async (file) => {
  const text = await extractText(file);
  if (file.startsWith('dashboard')) {
    await noteDataToFile('dashboard', text);
  } else {
    await noteDataToFile('task-manager', text);
  }
};

const batch = 5;

(async () => {
  const files = await readdir(snapshotsPath);
  const t0 = performance.now();

  await processFile(files[0]);

  // let currentIndex = 0;
  // for (const index in files) {
  //   if (currentIndex >= files.length) break;
  //
  //   const filesSlice = files.slice(currentIndex, (currentIndex + batch) >= files.length ? files.length : (currentIndex + batch));
  //   await Promise.all(filesSlice.map(((file) => processFile(file))));
  //   currentIndex += batch;
  //
  //   try {
  //     // Remove generated traineddata because it's broken and affect subsequent runs
  //     await unlink('./eng.traineddata');
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   await noteDataToFile('batches', `Handle batch done:\n${JSON.stringify(filesSlice)}`);
  // }
  const t1 = performance.now();
  console.log(`Call to doSomething took ${(t1 - t0) / 1000} seconds.`);
})();
