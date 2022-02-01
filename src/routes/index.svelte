<script context="module">
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
    ["ขึ้นต้นด้วย", "สน*", "สน, สนุก, สนามกีฬา,..."],
    ["มีตัวอักษรเรียงกันตามลำดับ", "*ก*ข*", "การขาย, กักขัง, สักขีพยาน, ..."],
    ["anagram ตัวอักษรทั้งหมด", "/าขม", "ขมา, ข้าม, ขี่ม้า, ..."],
    ["anagram ตัวอักษรทั้งหมด และเพิ่มอีก 1 ตัว", "/กา.", "กาว, เก้า, มาก, ..."],
    ["anagram ตัวอักษรทั้งหมด และเพิ่มอีกกี่ตัวก็ได้", "/มก*", "กม, ก้าม, กรรม, มัก, มาก, หมาก, ..."],
    ["มีไม่เกิน 6 ตัวอักษร และขึ้นต้นด้วย ที","-6:ที*", "ทีฆชาติ, ทีฆายุกา, ที่ปรึกษา, ..."],
    ["มี 3-8 ตัวอักษร และมี ก ข ค", "3-8:/กขค*", "ขนมครก, คณะลูกขุน, คุกเข่า, ..."],
    ["มีอย่างน้อย 7 ตัวอักษร และมี ฆ", "7-:*ฆ*", "การโฆษณา, ฆ้องกระแต, ..."],
    ["มี 7 ตัวอักษร มี ม อยู่ตำแหน่งที่ 3 และมี ส ะ", "7:..ม* & /สะ*", "สามัตถิยะ, เหมาะสม, อัสมิมานะ"]
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




<div class="flex flex-col justify-right justify-items-center text-center">
  <h1 class="text-5xl font-extrabold mb-2">TH Wordle Search</h1>
  <div>
    <input
      type="text"
      class="input input-bordered text-xl"
      on:keypress={onKeypress}
      bind:value={input}
      placeholder="พิมพ์รูปแบบที่นี่"
    />
    <button on:click={submit} class="btn btn-primary">
      หา
    </button>
    <button on:click={()=>query=""} class="btn btn-secondary">
      วิธีใช้
    </button> 
  </div>

  <div class="overflow-x-auto">
    {#if query}
      {#if currentQueryResults.length > 0}
        <span>แสดงผลลัพธ์ที่ {start+1} ถึง {Math.min(start+100, queryResults.count)} จาก {queryResults.count} คำ</span><br>
        {#each currentQueryResults as qr}
          <div data-tip="copy" class="tooltip">
            <button class="btn btn-outline text-lg font-thin" on:click={()=>
              navigator.clipboard.writeText(qr)
            }>{qr}</button>
          </div>
        {/each}
        <br>
        <div class="flex-row content-center">
          <div class="btn-group items-center">
            {#each Array(Math.floor(queryResults.count/100)+1) as _, idx}
              <button class="btn" name="pageButtons" on:click={()=>{
                start=idx*100;
                window.scrollTo(0, 0)
              }}>
                {idx+1}
              </button> 
            {/each}
          </div>
        </div>
      {:else}
        <span>ไม่เจอรูปแบบ </span> <span class="text-red-400"> {query} </span> <span>ลองใหม่นะ</span>
      {/if}
    {:else}
      <table class="table table-compact table-zebra w-full lg:table-normal">
        <thead>
          <tr>
            <th>ถ้าอยากหาคำที่...</th>
            <th>...ให้ใส่...</th>
            <th>...จะได้</th>
          </tr>
        </thead>
        <tbody>
          {#each examples as [desc, ip, result]}
          <tr>
            <td>{desc}</td>
            <td><div data-tip="ลองเลย" class="tooltip">
              <button class='btn btn-info btn-block text-sm font-normal lg:text-xl' on:click={()=>input=ip}>{ip}</button>
              </div></td>
            <td>{result}</td>
          </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<footer class="p-4 footer bg-base-300 text-base-content footer-center">
  <span>
    <a href="https://github.com/lemononmars/thwordsearch" target="_blank" class="link link-primary">Github</a>
    <a href="https://twitter.com/SakulbuthE" target="_blank" class="link link-primary">เสนอแนะ/แจ้งบัค</a>
  <span>
</footer>