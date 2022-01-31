<script context="module">
  export async function load({page}){
    return {
      props:{
        query: page.query.get('q'),
        start: parseInt(page.query.get('start')) || 0
      }
    }
  }
</script>

<script lang="ts">
  import Head from '$lib/Head.svelte'
  import {goto} from '$app/navigation'
  import {search} from '$lib/search'

  export let query: string
  export let start: number
  let input: string = query
  const atHomePage: boolean = (!query)? true: false
  let queryResults = search(query)
  $: currentQueryResults = queryResults.results.slice(start, start + Math.min(100, queryResults.count-start))

  const url = "https://lemononmars.github.io/thwordlesearch"
  const title = `${query || ""} TH Wordle Search`
  const description = "Find word pattern in Thai language"
  const imageUrl = ""
  const gtagId = ""

  const examples = [
    ["ทราบตัวอักษรบางตำแหน่งแล้ว","ส..น", "สงวน, สถาน, สุทัศน์, ..."],
    //["ตัวอักษรบางตำแหน่งเป็นไปได้หลายแบบ", "กร?ะ..", "กระจก, กะได, ..."],
    ["คำที่ขึ้นต้นด้วย", "สน*", "สน, สนุก, สนามกีฬา,..."],
    ["คำที่มีตัวอักษรเรียงกันตามลำดับ", "*ก*ข*", "การขาย, กักขัง, สักขีพยาน, ..."],
    ["anagram ตัวอักษรทั้งหมด", "/ขมา", "ข้าม, ขี่ม้า, มีขา, ..."],
    ["anagram ตัวอักษรทั้งหมด และเพิ่มอีก 1 ตัว", "/กา.", "กาว, เก้า, มาก, ..."],
    ["anagram ตัวอักษรทั้งหมด และเพิ่มอีกกี่ตัวก็ได้", "/มก*", "กม, ก้าม, กรรม, มัก, มาก, หมาก, ..."],
    //["6:น*ม", "นางงาม, นอบน้อม, ..."],
    //["3-5:*ฆ*", "ฆ้อน, ระฆัง, อาฆาต, ..."]
  ]

  function onKeypress(e: KeyboardEvent){
    if (e.key === "Enter") {
      e.preventDefault()
      submit()
    }
  }

  function submit(){
    if(!input)
      alert("ใส่คำก่อนสิเอ้อ!")
    else {
      queryResults = search(query)
      goto(`./?q=${input}&start=0`)
    }
  }
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} />
{#if atHomePage}
  <h1 class="text-5xl font-extrabold mb-2">TH Wordle Search</h1>
{/if}
<span>
  <input
    type="text"
    class="border px-4 py-1 text-center w-64"
    on:keypress={onKeypress}
    bind:value={input}
    placeholder="พิมพ์รูปแบบที่นี่"
    autofocus
  />
  <button on:click={submit}>
    หา
  </button>
</span>

<div class="flex-col items-left">
{#if query}
  {#if currentQueryResults.length > 0}
    <span>แสดงผลลัพธ์ที่ {start+1} ถึง {Math.min(start+100, queryResults.count)} จาก {queryResults.count} คำ</span><br>
    {#each currentQueryResults as qr}
      <span class="text-m hover:text-gray-200">{qr}</span><br>
    {/each}
    {#if queryResults.count > start+100}
      <a href={`/?q=${query}&start=${start+100}`} on:click={()=>{start+=100}}>หน้าต่อไป</a>
    {:else}
      <span class="text-s font-bold text-red-400">หมดแล้วจ้า</span>
    {/if}
  {:else}
    <span>ไม่เจอรูปแบบ "{query}" ลองใหม่นะ</span>
  {/if}
{/if}
</div>

{#if atHomePage}
<div class="w-full h-screen py-4 flex flex-col items-center">
  <h2 class="text-xl font-extrabold mb-2">วิธีใช้งานเบื้องต้น</h2>
  <table class="text-m table-auto border-collapse border border-slate-500">
    <thead class="bg-indigo-500">
      <tr>
        <th class="border border-slate-600">ถ้าอยากหาคำที่...</th>
        <th class="border border-slate-600">...ให้ใส่...</th>
        <th class="border border-slate-600">...จะได้</th>
      </tr>
    </thead>
    <tbody>
      {#each examples as [desc, input, result]}
      <tr>
        <td class="border border-slate-300">{desc}</td>
        <td class="border border-slate-300">{input}</td>
        <td class="border border-slate-300">{result}</td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>
{/if}

<style lang="postcss">
  p {
    @apply text-lg;
    @apply mt-0 mb-1;
  }
  pre {
    @apply transition-colors duration-500;
    @apply text-left p-2 bg-gray-200;
    :global(.dark) & {
      @apply bg-gray-800;
    }
  }
  input {
    @apply transition-colors duration-500;
    @apply text-left p-2 bg-gray-200;
    :global(.dark) & {
      @apply bg-gray-800;
    }
  }
</style>
