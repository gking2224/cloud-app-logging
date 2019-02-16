import { Logger } from '.';

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

  const createSeverityLogger = (severity: string) => async (message: string) => {
    const msg = { severity, message, logStream: 'chat-app-ui' };
    ws.send(JSON.stringify(msg));
  };
  const debug = createSeverityLogger('debug');
  return ({
    debug,
  });
};
