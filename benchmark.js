/* eslint-disable no-console */
import fs from 'fs';
import minimist from 'minimist';
import humps from 'humps';

// Handle cli params
const args = minimist(process.argv.slice(2));
const { namespace } = humps.camelizeKeys(args);

const dashboardData = fs.readFileSync(`./benchmarks/${namespace}.dashboard.txt`).toString().split('\n');
const taskManagerData = fs.readFileSync(`./benchmarks/${namespace}.task-manager.txt`).toString().split('\n');

const domNodes = [];
const jsHeapSize = [];
const dashboard = [];
const linkedInProfileMem = [];

dashboardData.forEach((input) => {
  const normalizedInput = input.toLowerCase().trim().replace(/,/g, '');
  const extractedValue = normalizedInput.replace(/[^0-9]+/g, '');

  if (parseInt(extractedValue, 10)) {
    if (normalizedInput.includes('dom')) {
      domNodes.push(extractedValue);
    } else if (normalizedInput.includes('heap')) {
      jsHeapSize.push(extractedValue);
    }
  }
}, {});


taskManagerData.forEach((input) => {
  const normalizedInput = input.toLowerCase().trim().replace(/,/g, '');
  const extractedValue = normalizedInput.slice(-13).replace(/[^0-9]+/g, '');

  if (parseInt(extractedValue, 10)) {
    if (normalizedInput.includes('social automation')) {
      dashboard.push(extractedValue);
    } else if (normalizedInput.includes('| linkedin')) {
      linkedInProfileMem.push(extractedValue);
    }
  }
}, {});

console.log(`\nBenchmark Result for: ${namespace}\n`);
console.log(`DOM Nodes: ${domNodes[0]} upto ${Math.max(...domNodes)}`);
console.log(`JS Heap Size: ${jsHeapSize[0]} MB upto ${Math.max(...jsHeapSize)} MB`);
console.log(`Dashboard Memory: ${dashboard[0]} MB upto ${Math.max(...dashboard)} MB`);
console.log(`LinkedIn Profile Memory: ${linkedInProfileMem[0]} MB upto ${Math.max(...linkedInProfileMem)} MB\n`);
