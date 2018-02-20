## Question 3

Find an example of an error event being emitted in any of the built in Node libraries. Make a note of what library you found it in, the name of the function that can emit the error event, any potential causes of the error, any information attached to the error event.

## SOLUTION 1:

###Node Library:
 - Writeable Streams library
###Function emitting the error event:
 - write
###Error causes:
 - The 'error' event is emitted if an error occurred while writing or piping data.

###Information regarding the error event:
The listener callback is passed a single Error argument when called.
Note: The stream is not closed when the 'error' event is emitted.

## SOLUTION 2:

###Node Library:
 - Readable Streams also)
###Function emitting the error event:
 - Two Modes#
Readable streams effectively operate in one of two modes: flowing and paused.

When in flowing mode, data is read from the underlying system automatically and provided to an application as quickly as possible using events via the EventEmitter interface.
 - There is a lot of info here. Check out [Node.js Documentation](https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_readable_streams)
###Error causes:
 - Event: 'error'#

Added in: v0.9.4
<Error>
The 'error' event may be emitted by a Readable implementation at any time. Typically, this may occur if the underlying stream in unable to generate data due to an underlying internal failure, or when a stream implementation attempts to push an invalid chunk of data.

The listener callback will be passed a single Error object.

###Information regarding the error event:
[Node.js Documentation](https://nodejs.org/dist/latest-v6.x/docs/api/stream.html#stream_readable_streams)




####Other
As a best practice, listeners should always be added for the 'error' events on event emitter objects.

const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.log('whoops! there was an error');
});
myEmitter.emit('error', new Error('whoops!'));
// Prints: whoops! there was an error
