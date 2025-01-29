<script lang="ts">
  import '../global.postcss'
  import { onMount } from 'svelte'

  onMount(() => {
    document.querySelector('html').classList.add('dark')
  })
</script>

<main>
  <slot />
</main>
