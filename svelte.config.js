import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-static'

const dev = process.env.NODE_ENV === 'development';
/** @type {import('@sveltejs/kit').Config} */
export default {
  preprocess: [
    preprocess({
      defaults: {
        style: 'postcss'
      },
      postcss: true
    })
  ],

  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: null,
      precompress: false
    }),
    target: '#svelte',
    paths: {
      base: dev? '':'/thwordsearch',
    },
    appDir: 'app_'
  },

 
}
