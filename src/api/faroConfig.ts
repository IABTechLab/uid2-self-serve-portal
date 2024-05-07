import axios from 'axios';

export type FaroConfigVariables = {
  apiKey: string;
  portAppReceiver: number;
  host: string;
  clientPackageName: string;
  packageVersion: string;
  serverLogsPath: string;
  serverLogsName: string;
  serverPackageName: string;
};

export async function getFaroConfig() {
  // nodeEnv?: string | undefined
  // nodeEnv = nodeEnv ?? 'development';

  // const prod = nodeEnv === 'production';
  // const test = !prod && nodeEnv === 'test';
  // const dev = !prod && !test;
  // const mode = {
  //   prod,
  //   test,
  //   dev,
  //   name: prod ? 'production' : test ? 'test' : 'development',
  // };
  const result = await axios.get<FaroConfigVariables>(`/faroConfig`, {
    validateStatus: (status) => status === 200,
  });
  const config = result.data;

  return {
    faro: {
      apiKey: config.apiKey!,
      host: config.host!,
      portAppReceiver: config.portAppReceiver!,
      // portTraces: vars['TEMPO_PORT_OTLP_RECEIVER']!,
    },
    client: {
      packageName: config.clientPackageName!,
    },
    // grafana: {
    //   port: vars['GRAFANA_PORT']!,
    // },
    package: {
      version: config.packageVersion!,
    },
    server: {
      logsPath: config.serverLogsPath!,
      logsName: config.serverLogsName!,
      packageName: config.serverPackageName!,
      // port: vars['DEMO_PORT']!,
    },
    // mode,
  };
}

// export function getPublicEnvConfig({ database: _database, ...env } = getFaroConfig(process.env)) {
//   return env;
// }

export type Env = ReturnType<typeof getFaroConfig>;

export type PublicEnv = ReturnType<typeof getFaroConfig>;
