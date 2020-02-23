#!/usr/bin/env node
/*
MIT License

Copyright (c) 2017 Bryan Hughes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const SerialPort = require('serialport');
const readline = require('readline');

const DEFAULT_BAUDRATE = 112500;

const VALID_PORT_REGEX = /usb|acm|^com/i;

function watchSerialPort(port, options) {
  console.log(`\nWatching serial port ${port}`);
  for (const option in options) {
    if (!options.hasOwnProperty(option)) {
      continue;
    }
    console.log(`  ${option}: ${options[option]}`);
  }
  console.log('---------------------------------------------------------------');

  const portInstance = new SerialPort(port, options);

  // Open errors will be emitted as an error event
  portInstance.on('error', (err) => {
    console.error(`Serial port error: ${err.message}`);
    process.exit(-1);
  });

  portInstance.on('data', (data) => {
    process.stdout.write(data);
  });
}

(async() => {
  const ports = await SerialPort.list();

  // Match only ports that Arduino cares about
  // ttyUSB#, cu.usbmodem#, COM#
  const filteredPorts = ports.filter((port) => VALID_PORT_REGEX.test(port.path));

  const argv = require('yargs')
    .usage('Usage: seriallog [options]')
    .option('port', {
      alias: 'p',
      describe: 'The serial port to open',
      choices: filteredPorts.map((port) => port.path)
    })
    .option('baudrate', {
      alias: 'b',
      describe: 'The baudrate of the port',
      default: DEFAULT_BAUDRATE,
      number: true
    })
    .help('h')
    .alias('h', 'help')
    .argv;

  const options = {
    baudRate: argv.baudrate
  };

  if (argv.port) {
    watchSerialPort(argv.port, options);
    return;
  }

  if (filteredPorts.length === 0) {
    console.error('Could not find any valid serial ports to log');
  } else if (filteredPorts.length === 1) {
    watchSerialPort(filteredPorts[0].path, options);
  } else {
    console.log('More than one serial port was detected:\n');
    for (let i = 0; i < filteredPorts.length; i++) {
      console.log(`  [${i + 1}]: ${filteredPorts[i].path}`);
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    function prompt() {
      rl.question('\nWhich serial port would you like to use? [1] ', (answer) => {
        if (answer === '') {
          rl.close();
          watchSerialPort(filteredPorts[0].path, options);
        } else {
          const parsedAnswer = parseInt(answer);
          if (isNaN(parsedAnswer) || parsedAnswer <= 0 || parsedAnswer > filteredPorts.length) {
            console.error(`"${answer}" is not a valid serial port entry`);
            prompt();
          } else {
            rl.close();
            watchSerialPort(filteredPorts[parsedAnswer - 1].path, options);
          }
        }
      });
    }
    prompt();
  }

})();
