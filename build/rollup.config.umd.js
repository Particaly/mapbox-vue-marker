import base from './rollup.config.base'

const config = Object.assign({}, base, {
  output: {
    // exports: 'named',
    name: 'Ptpopup',
    file: 'dist/index.js',
    format: 'umd'
  },
});

export default config
