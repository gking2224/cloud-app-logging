import { Literal, Record, Static, String, Union } from 'runtypes';
import { Logger } from '.';

const SeverityValidation = Union(
  Literal('debug'), Literal('info'), Literal('trace'), Literal('warn'), Literal('error'), Literal('fatal'),
);
export type Severity = Static<typeof SeverityValidation>;

export const LogMessageValidation = Record({
  application: String,
  message: String,
  severity: SeverityValidation,
});
export type LogMessage = Static<typeof LogMessageValidation>;
export const validateLogMessage = (m: any) => LogMessageValidation.check(m);

export const websocketLogger: (endpoint: string) => Logger = (endpoint) => {
  const ws = new WebSocket(endpoint);
  const onOpen = () => null;
  const onError = console.error;
  const onMessage = (m: any) => {
    console.log('Received message from remote logger: ', m);
  };
  const onClose = () => null;

  ws.onopen = onOpen; // tslint:disable-line:no-object-mutation
  ws.onerror = onError; // tslint:disable-line:no-object-mutation
  ws.onmessage = onMessage; // tslint:disable-line:no-object-mutation
  ws.onclose = onClose; // tslint:disable-line:no-object-mutation

  const createSeverityLogger = (severity: Severity) => async (message: string) => {
    const msg: LogMessage = { severity, message, application: 'chat-app-ui' };
    ws.send(JSON.stringify(msg));
  };
  const debug = createSeverityLogger('debug');
  return ({
    debug,
  });
};
