/**
 * @module reader.ts
 * @author Benedict R. Gaster
 * @copyright Benedict R. Gaster 2017
 *
 * 
 *
 * @license See LICENSE
 */
import events = require("events") // Node emitter library

const path = require('path');
const addon_path = path.join(__dirname, "../Release/nfc_reader");

const worker = require("streaming-worker");
const nfc_stream = worker(addon_path);

class NFCReader extends events.EventEmitter {
  private receivedEvent_ : string

  public constructor(receivedEvent: string = 'received') {
      super()

      this.receivedEvent_ = receivedEvent

      nfc_stream.from.on('nfc_id', this.handleReading);
  }

  private handleReading = (reading : string) => {
    this.emit(this.receivedEvent_, reading)
  }

  /**
    * Getter that is the name of the event to listed to for NFC card reads
    * @return {string} listener for emitted NFC card read events
    */
  public get receivedEvent(): string {
      //console.log("receivedEvent_ = " + this.receivedEvent_)
      return this.receivedEvent_;
  }
}

export { NFCReader };
