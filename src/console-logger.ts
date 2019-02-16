import { Logger } from '.';

export const consoleLogger: Logger = ({
  debug: async (s: string) => {
    console.log(s);
  },
});
