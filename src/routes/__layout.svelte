<script lang="ts">
  import '../global.postcss'
  import { theme } from './store'
  import { onMount } from 'svelte'
  //import ToggleTheme from '$lib/ToggleTheme.svelte'

  onMount(() => {
    document.querySelector('html').classList.add('dark')
  })
</script>

<main>
  <slot />
</main>
