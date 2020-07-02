const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const env = process.env.NODE_ENV || 'development';

const watching = process.argv.includes('-w');

const build = async () => {
  const entry = path.resolve(__dirname, './src/index.tsx');
  const out = path.resolve(__dirname, './dist/bundle.js');
  console.info(`Bundling ${entry}...`);
  try {
    await esbuild.build({
      entryPoints: [entry],
      outfile: out,
      minify: true,
      bundle: true,
      define: {
        'process.env.NODE_ENV': `"${env}"`,
      }
    })
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.info('Bundling finished.');
}

build().then(() => {
  if (watching) {
    console.log('Watching...');
    const sane = require('sane');
    sane('./src', { glob: ['**/*.ts', '**/*.tsx'] }).on('change', build);
  }
})
