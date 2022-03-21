# Autocapture With OCR

Make Linked Booster benchmarking less painful

This helps:

1. Capture screen at specific regions with interval
2. Read texts from screenshots with OCR
3. Extract benchmark values from OCR-ed text

Built with:

- [Tesseract.js](https://tesseract.projectnaptha.com/): OCR module using AI
- [sharp](https://sharp.pixelplumbing.com/): Used for image processing to help Tesseract read image with higher
  accuracy

**Quick Demo**

[!](https://user-images.githubusercontent.com/40330059/159343981-f63d0c2d-057f-4005-8357-f798e5b6c539.mp4)

## I. Prerequisites

- Node 14+
- Python 3.8
- Windows OS

## II. Installation

Open Terminal, run:

```javascript
npm install -g node-gyp
npm install -g windows-build-tools
```

Open project root folder, run:

```javascript
yarn install
```

## III. Commands

`*` mean `required`

### 1. Capture screen at specific regions with interval

#### Command

```javascript
node screen-capture.js
```

#### CLI Parameters

| Params          | Description                        | Value                                                          |
| :-------------- | :--------------------------------- | :------------------------------------------------------------- |
| dashboard \*    | Coordinates of Dashboard region    | [left]-[top]-[width]-[height]                                  |
| task-manager \* | Coordinates of Task Manager region | [left]-[top]-[width]-[height]                                  |
| namespace \*    | Name of the capture            | Differentiate different captures                               |
| interval        | Interval between captures in milliseconds            | A number. Default: `1000` |

#### Example:

```javascript
node screen-capture.js --dashboard 627-592-309-88 --task-manager 1032-76-859-283 --namespace snapshots_1
```

### 2. Read texts from snapshots with OCR

#### Command

```javascript
node extract-texts.js
```

#### CLI Parameters

| Params       | Description                                | Value                       |
| :----------- | :----------------------------------------- | :-------------------------- |
| namespace \* | Name of the capture do you want to analyze | Capture name: Ex: capture_1 |
| batch-size \* | The tool process images in batches. Higher batch size will slightly reduce processing time (about 5 - 10%) but more chance of unexpected error while running | A number. Default: `3` |

#### Example:

```javascript
node extract-texts.js  --batch-size 4 --namespace snapshots_1
```

### 3. Extract benchmark values from OCR-ed text

#### Command

```javascript
node benchmark.js
```

#### CLI Parameters

| Params        | Description                                                                                                                                           | Value                       |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------- |
| namespace \*  | Name of the capture do you want to analyze                                                                                                            | Capture name: Ex: capture_1 |

#### Example:

```javascript
node benchmark.js --namespace snapshots_1
```

## IV. Preparation for benchmarking

1. Open Chrome and Chrome Task Manager on **your Primary Display**, put them to equal grids like this
   ![](./docs/images/image-1.png)
2. Use some image editing tools to find coordinates of the regions you want to capture. For example.
3. Dashboard region: `left: 620`, `top: 613`, `width: 309`, `height: 88`
   ![](./docs/images/image-2.png)
4. Task manager region: `left: 1029`, `top: 75`, `width: 859`, `height: 283`
   ![](./docs/images/image-3.png)
5. Open Extensions page and disable others extensions
6. Open Dashboard Devtools. Select display mode as floating windows
   ![](./docs/images/image-5.png)
7. Focus on the floating Devtools and press Ctrl + Shift + I to open the root Devtools
   ![](./docs/images/image-6.png)
8. Paste in this code into the Console and Enter. It will throttle CPU in half. Can customize throttling rate with the
   `rate` options

```javascript
let Main = await import('./devtools-frontend/front_end/entrypoints/main/main.js');
await Main.MainImpl.sendOverProtocol('Emulation.setCPUThrottlingRate', { rate: 2 });
```

## V. Start Benchmark

1. After arranging windows and identify capturing regions coordinates
2. Start terminal at root folder
3. Run [Command I](#capture-screen-at-specific-regions-with-interval) to capture. Ctrl + C to stop capturing
4. Run command [Command II](#read-texts-from-snapshots-with-ocr) with `--namespace` same as step 3
5. Run command [Command III](#extract-benchmark-values-from-ocr-ed-text) with `--namespace` same as step 3
6. The benchmark values will be logged to Terminal

## VI. Common Errors

### 1. createWorker Runtime error
![image](https://user-images.githubusercontent.com/40330059/159348105-5fd2cd1e-34da-41ed-94a0-5c258fa856f6.png)

#### Fix

Find the file with name: `eng.traineddata` in the root folder and delete it, then run the command again
