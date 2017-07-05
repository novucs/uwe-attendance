/**
 * @module nfc.cpp
 * @author Benedict R. Gaster
 * @copyright Benedict R. Gaster 2017
 *
 * Node addon to read NFC id's from student cards. The addon runs until killed
 * simply emitting, via a event stream, a NFC ID each time it reads a card.
 *
 * @license See LICENSE
 */
#include <node.h>
#include <nan.h>  // includes v8 too
#include "streaming-worker.h" // allows us to easily build emitter

#include <stdio.h>
#include "nfc.h"

using namespace Nan;
using namespace std;
//using namespace v8;

class NFCReaderWorker : public StreamingWorker {
    public:
        NFCReaderWorker(
            Callback *data,
            Callback *complete,
            Callback *error_callback,
            v8::Local<v8::Object> & options)
          : StreamingWorker(data, complete, error_callback){

        // nothing needs to be here - just make sure you call base constructor
        // The options parameter is for your JavaScript code to pass in
        // an options object.  You can use this for whatever you want.
    }

    // You must match the call signature here, `Execute` is a virtual function
    // defined on Streaing Worker.
    void Execute (const AsyncProgressWorker::ExecutionProgress& progress) {

      // Just send 100 integers and stop
      for (int i = 0; i < 100; i++ ) {
        Message tosend("nfc_id", "nfc_reading");
        writeToNode(progress, tosend);
      }
    }
};

StreamingWorker * create_worker(Callback *data
    , Callback *complete
    , Callback *error_callback,
    v8::Local<v8::Object> & options) {

 return new NFCReaderWorker(data, complete, error_callback, options);
}

NODE_MODULE(read_nfc, StreamWorkerWrapper::Init)
