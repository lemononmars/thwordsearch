<script lang="ts">
  import { theme } from '../routes/store'

  const toggleTheme = () => {
    $theme = $theme === 'dark' ? 'light' : 'dark'

    document.querySelector('html').classList.toggle('dark')
  }

  $: themeText = $theme === 'dark'? 'Light mode' : 'Dark mode'
</script>

<input type="checkbox" checked="checked" on:click={toggleTheme} class="toggle"> <span>{themeText}</span>