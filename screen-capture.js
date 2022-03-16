/* eslint-disable no-console */
import screenshot from 'screenshot-desktop';
import sharp from 'sharp';

setInterval(async () => {
  try {
    const image = await screenshot();
    const timestamp = new Date().getTime();
    const pathDashboardSnapshots = `./snapshots/dashboard-${timestamp}.jpg`;
    const pathTaskManagerSnapshots = `./snapshots/task-manager-${timestamp}.jpg`;
    const errorCallback = (error) => (error ? console.log(error) : console.log('Snapped'));

    await sharp(image)
      .extract({
        left: 646, top: 296, width: 402, height: 440,
      })
      .grayscale()
      .resize(1500, undefined)
      .toFile(pathDashboardSnapshots, errorCallback);

    await sharp(image)
      .extract({
        left: 1125, top: 85, width: 770, height: 676,
      })
      .grayscale()
      .resize(1500, undefined)
      .toFile(pathTaskManagerSnapshots, errorCallback);
  } catch (error) {
    console.log('Failed to capture screenshots');
  }
}, 1500);
