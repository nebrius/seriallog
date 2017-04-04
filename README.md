# seriallog

A small command-line utility for logging the output of a serial port in real time.

## Installation

Install globally with npm:

```
npm install -g seriallog
```

## Usage

Serial log will often work without any options:

```
seriallog
```

However, you can also specify baud rate and port:

```
seriallog --baudrate 9600 --port /dev/cu.usbserial-12345678
```

If you do not specify a serial port, it will try and figure it out for you. If there is more than one serial port available, it will prompt you for the port you prefer.

If you do not specify a baudrate, it defaults to 115200.

For more information, run `seriallog --help`

## License

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
