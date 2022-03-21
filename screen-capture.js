/* eslint-disable no-console */
import fs from 'fs';
import screenshot from 'screenshot-desktop';
import sharp from 'sharp';
import minimist from 'minimist';
import humps from 'humps';


// Handle cli params
const args = minimist(process.argv.slice(2));
const {
  dashboard, taskManager, interval, namespace,
} = humps.camelizeKeys(args);

const dashboardCoordinates = dashboard.split('-').map((coordinate) => parseInt(coordinate, 10));
const taskManagerCoordinates = taskManager.split('-').map((coordinate) => parseInt(coordinate, 10));


// Create folder to store snapshots
const snapshotsPath = `./snapshots/${namespace}`;
if (!fs.existsSync(snapshotsPath)) {
  fs.mkdirSync(snapshotsPath);
}


// Capture screen with interval
setInterval(async () => {
  try {
    const image = await screenshot();
    const timestamp = new Date().getTime();

    const pathDashboardSnapshots = `${snapshotsPath}/dashboard-${timestamp}.jpg`;
    const pathTaskManagerSnapshots = `${snapshotsPath}/task-manager-${timestamp}.jpg`;

    const callback = (error) => (error ? console.log(error) : console.log('Captured success!'));

    // Capture Dashboard Performance Monitor
    sharp(image)
      .extract({
        left: dashboardCoordinates[0],
        top: dashboardCoordinates[1],
        width: dashboardCoordinates[2],
        height: dashboardCoordinates[3],
      })
      .grayscale()
      .resize(taskManagerCoordinates[2] * 2)
      .toFile(pathDashboardSnapshots, callback);

    // Capture Task Manager
    sharp(image)
      .extract({
        left: taskManagerCoordinates[0],
        top: taskManagerCoordinates[1],
        width: taskManagerCoordinates[2],
        height: taskManagerCoordinates[3],
      })
      .grayscale()
      .resize(taskManagerCoordinates[2] * 2)
      .toFile(pathTaskManagerSnapshots, callback);
  } catch (error) {
    console.log(error);
    console.log('Failed to capture screenshots');
  }
}, interval ? parseInt(interval, 10) : 1000);
