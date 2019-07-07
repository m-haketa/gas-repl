import * as repl from 'repl';
import {EventEmitter} from 'events';

export class GasRepl {
  private clasp;
  private event: EventEmitter;

  constructor(event: EventEmitter, clasp) {
    this.event = event;
    this.clasp = clasp;
  }

  start(): Promise<EventEmitter> {
    return new Promise((resolve, reject) => {
      const replServer = repl.start({
        prompt: '> ',
        eval: (cmd, context, filename, callback) => {
          this.event.once('result', (result) => callback(null, result));
          this.event.emit('input', cmd.trim());
        }
      });
//      replServer.setupHistory('.gas-repl.history', (err, repl) => {});
      replServer.on('exit', () => {
        this.event.emit('exit', 'REPL exit.')
      });
      resolve(replServer);
    });
  }
}
