import { Literal, Static, Union } from 'runtypes';
import { consoleLogger } from './console-logger';
import { websocketLogger } from './websocket-logger';
export { LogMessage, Severity, validateLogMessage, websocketLogger, LogMessageValidation } from './websocket-logger';

export type Logger = ({ debug: ((s: string) => Promise<void>) });

const LoggerTypeValidation = Union(Literal('cloudwatch'), Literal('console'));
export type LoggerType = Static<typeof LoggerTypeValidation>;

export const chooseLogger = (): Logger => {
  const loggerType = process.env.LOGGER_TYPE || 'console';
  if (LoggerTypeValidation.validate(loggerType).success) {
    return getLoggerOfType(loggerType as LoggerType);
  }
  console.error(`Invalid loggerType '${loggerType}', falling back to console logger`);
  return consoleLogger;
};

export const getLoggerOfType = (loggerType: LoggerType): Logger => {
  switch (loggerType) {
    case 'cloudwatch':
      return websocketLogger(
        process.env.WEBSOCKET_LOGGER_ENDPOINT || '', process.env.WEBSOCKET_LOGGER_APPLICATION || '<Unknown>');
    case 'console':
      return consoleLogger;
  }
};

export default consoleLogger;
