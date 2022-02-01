<script lang="ts">
   import { Facebook, Twitter } from "svelte-share-buttons-component"
 
   export let url: string
   export let title: string
   export let description: string
 </script>
 
 {#if url}
   <div>
     <Facebook class="h-10 w-10" quote="{description}" {url} />
     <Twitter class="h-10 w-10" text="{title} - {description}" {url} />
   </div>
 {/if}
 