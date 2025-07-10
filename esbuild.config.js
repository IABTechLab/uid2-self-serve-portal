import { build } from 'esbuild';
import { globSync } from 'glob';
import fs from 'fs';

const entryPoints = [
  ...globSync('src/api/**/*.ts'),
  ...globSync('src/database/**/*.ts'),
];

// add .js extensions in the esbuild
const rewriteImports = {
  name: 'rewrite-imports',
  setup(build) {
    build.onLoad({ filter: /\.(ts|js)$/ }, async (args) => {
      let source = await fs.promises.readFile(args.path, 'utf8');

      const rewritten = source.replace(
        /((?:import|export)\s[\s\S]+?from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
        (_match, pre, imp, post) => {
          if (imp.endsWith('.ts')) {
            return `${pre}${imp.slice(0, -3)}.js${post}`;
          }
          if (/\.[a-z]+$/.test(imp)) {
            return `${pre}${imp}${post}`;
          }
          return `${pre}${imp}.js${post}`;
        }
      );

      return {
        contents: rewritten,
        loader: 'ts',
      };
    });
  }
};

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

const rewriteKnexfileImports = {
  name: 'rewrite-knexfile-imports',
  setup(build) {
    build.onLoad({ filter: /knexfile\.ts$/ }, async (args) => {
      let source = await fs.promises.readFile(args.path, 'utf8');

      // Rewrites only the envars import
      const rewritten = source.replace(
        /from\s+['"]\.\/src\/api\/envars\.ts['"]/,
        'from "./api-dist/api/envars.js"'
      );

      return {
        contents: rewritten,
        loader: 'ts',
      };
    });
  }
};

await build({
  entryPoints: ['knexfile.ts'],
  outfile: 'api-dist/knexfile.js',
  bundle: false,
  platform: 'node',
  format: 'esm',
	plugins: [rewriteKnexfileImports]
});