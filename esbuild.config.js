import { build } from 'esbuild';
import { globSync } from 'glob';
import fs from 'fs';

const entryPoints = [
  ...globSync('src/api/**/*.ts'),
  ...globSync('src/database/**/*.ts')
];

// add .js extensions in the esbuild
const rewriteImports = {
  name: 'rewrite-imports',
  setup(build) {
    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      let source = await fs.promises.readFile(args.path, 'utf8');

      const rewritten = source.replace(
        /((?:import|export)\s.+?from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
        (_match, pre, imp, post) => {
          if (/\.[a-z]+$/.test(imp)) return `${pre}${imp}${post}`;
          return `${pre}${imp}.js${post}`;
        }
      );

      return {
        contents: rewritten,
        loader: 'ts',
      };
    });
  }
}

await build({
  entryPoints,
  outdir: 'api-dist',
  outbase: 'src',
  platform: 'node',
  format: 'esm',
  target: 'node20',
  bundle: false,
  sourcemap: true,
  logLevel: 'info',
  plugins: [rewriteImports],
});
