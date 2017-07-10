import * as events from "events";
import * as path from "path";
import * as worker from "streaming-worker";

const nfcReaderPath = path.join(__dirname, "../Release/nfc_reader");
const nfcReaderStream = worker(nfcReaderPath);

class NFCReader extends events.EventEmitter {
    private receivedEvent_: string;

    public constructor(receivedEvent: string = 'received') {
        super();
        this.receivedEvent_ = receivedEvent;
        nfcReaderStream.from.on('nfc_id', this.handleReading);
    }

    private handleReading = (reading: string) => {
        this.emit(this.receivedEvent_, reading)
    };

    /**
     * Getter that is the name of the event to listed to for NFC card reads
     * @return {string} listener for emitted NFC card read events
     */
    public get receivedEvent(): string {
        return this.receivedEvent_;
    }
}

export {NFCReader};
