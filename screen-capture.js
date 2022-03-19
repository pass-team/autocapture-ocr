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
        left: 675, top: 314, width: 265, height: 77,
      })
      .grayscale()
      .resize(800, undefined)
      .toFile(pathDashboardSnapshots, errorCallback);

    await sharp(image)
      .extract({
        left: 1030, top: 78, width: 776, height: 169,
      })
      .grayscale()
      .resize(2500, undefined)
      .toFile(pathTaskManagerSnapshots, errorCallback);
  } catch (error) {
    console.log('Failed to capture screenshots');
  }
}, 1500);
