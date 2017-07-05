import { Injectable, Input } from '@angular/core';
import { Observable, Observer, BehaviorSubject } from 'rxjs';

export interface TagID {
  tagID : string;
}

interface Message {
  type: string; // "should be nfc_reading"
  text?: string; // if tag present
}

@Injectable()
export class SocketService {

  constructor() { }

}
