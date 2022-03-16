/* eslint-disable no-console,no-await-in-loop */
import { readdir, appendFile, unlink } from 'fs/promises';
import { createWorker } from 'tesseract.js';

const snapshotsPath = './snapshots';

const noteDataToFile = async (target, data) => {
  const targetFile = `./${target}.txt`;
  await appendFile(targetFile, data, { flag: 'a', encoding: 'utf-8' });
};

const initWorker = async () => {
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  return worker;
};

const processFile = async (file, worker) => {
  const { data: { text } } = await worker.recognize(`${snapshotsPath}/${file}`, 'eng');
  if (file.startsWith('dashboard')) {
    await noteDataToFile('dashboard', text);
  } else {
    await noteDataToFile('task-manager', text);
  }
};

(async () => {
  const worker = await initWorker();
  const files = await readdir(snapshotsPath);

  for (const index in files) {
    processFile(files[index], worker);
  }
})();
