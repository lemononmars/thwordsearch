<script context="module">
	export const hydrate = false;
  export const prerender = true;
</script>

<script lang="ts">
  import Head from '$lib/Head.svelte'
  import {search} from '$lib/search'

  let query: string = ""
  let start: number = 0
  let input: string = query
  const atHomePage: boolean = (!query)? true: false
  let queryResults = search(query)
  $: currentQueryResults = queryResults.results.slice(start, start + Math.min(100, queryResults.count-start))

  const url = "https://lemononmars.github.io/thwordsearch"
  const title = `${query || ""} TH Wordle Search`
  const description = "Pattern-matching in Thai language"
  const imageUrl = ""
  const gtagId = ""

  let modalText: string = ""

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
      query = input
      start = 0
      queryResults = search(query)
    }
  }
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} />
<h1 class="text-5xl font-extrabold mb-2">TH Wordle Search</h1>
<span>
  <input
    type="text"
    class="input input-bordered"
    on:keypress={onKeypress}
    bind:value={input}
    placeholder="พิมพ์รูปแบบที่นี่"
    autofocus
  />
  <button on:click={submit} class="btn btn-primary">
    หา
  </button>
  <button on:click={()=>query=""} class="btn btn-secondary">
    วิธีใช้
  </button> 
</span>

<div class="flex-col content-center">
{#if query}
  {#if currentQueryResults.length > 0}
    <span>แสดงผลลัพธ์ที่ {start+1} ถึง {Math.min(start+100, queryResults.count)} จาก {queryResults.count} คำ</span><br>
    {#each currentQueryResults as qr}
        <button class="btn btn-outline text-lg">{qr}</button>
    {/each}
    <br>
    <div class="flex-row content-center">
      <div class="btn-group items-center">
        {#each Array(Math.floor(queryResults.count/100)+1) as _, idx}
          <button class="btn" name="pageButtons" on:click={()=>start=idx*100}>{idx+1}</button> 
        {/each}
      </div>
    </div>
  {:else}
    <span>ไม่เจอรูปแบบ "{query}" ลองใหม่นะ</span>
  {/if}
{:else}
      <table class="table">
        <thead>
          <tr>
            <th>ถ้าอยากหาคำที่...</th>
            <th>...ให้ใส่...</th>
            <th>...จะได้</th>
          </tr>
        </thead>
        <tbody>
          {#each examples as [desc, input, result]}
          <tr>
            <td>{desc}</td>
            <td>{input}</td>
            <td>{result}</td>
          </tr>
          {/each}
        </tbody>
      </table>
{/if}
</div>