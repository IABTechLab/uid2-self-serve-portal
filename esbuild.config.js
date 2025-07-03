import { build } from 'esbuild';
import { globSync } from 'glob';

const entryPoints = [
  ...globSync('src/api/**/*.ts'),
  ...globSync('src/database/**/*.ts')
];

build({
  entryPoints,
  outdir: 'api-dist',
  platform: 'node',
  format: 'esm',
  target: 'node20',
  outbase: 'src',
  sourcemap: true,
  bundle: false,
  loader: { '.ts': 'ts' },
  logLevel: 'info'
}).catch(() => process.exit(1));
