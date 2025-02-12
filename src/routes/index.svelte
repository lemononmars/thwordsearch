<script lang="ts">
  import Head from '$lib/Head.svelte'
  import Social from '$lib/Social.svelte'
  import {search, getFirstLetter} from '$lib/search'

  let query: string = ""
  let start: number = 0
  let input: string = query
  //const atHomePage: boolean = (!query)? true: false
  let includeWiki: boolean = false
  let queryResults = search(query, includeWiki)
  let mode: number = 1 // 0 = page, 1 = first letter
  let letter: string = ""
  let allFirstLetters = []
  $: filteredResults = letter === "" ? queryResults.results: queryResults.results.filter(r=>getFirstLetter(r) == letter)
  $: currentQueryResults = filteredResults.slice(start, start + Math.min(100, queryResults.count-start))

  const url = "https://lemononmars.github.io/thwordsearch"
  const title = "TH Wordle Search"
  const description = "Pattern-matching in Thai language"
  const imageUrl = ""
  const gtagId = "G-YTV7TZ3EMC"

  let modalText: string = ""

  const examples = [
    ["มีตัวอักษรในตำแหน่งที่กำหนด","ส..น", "สงวน, สถาน, สุทัศน์, ..."],
    //["ตัวอักษรบางตำแหน่งเป็นไปได้หลายแบบ", "กร?ะ..", "กระจก, กะได, ..."],
    ["ขึ้นต้นด้วย สับ", "สับ*", "สับไก, สับราง, สับปะรด,..."],
    ["มีตัวอักษรเรียงกันตามลำดับ", "*ธ*ท*", "กรีธาทัพ, ธรณีวิทยา, อิทธิบาท, ..."],
    ["anagram ตัวอักษรทั้งหมด", "/กลม", "กมล, มกุล, มีลูก, ..."],
    ["anagram ตัวอักษรทั้งหมด และเพิ่มอีกกี่ตัวก็ได้", "/กะลา*", "การละคร, เจาะลึก, เพาะปลูก, ..."],
    ["มี 3-8 ตัวอักษร และมี ก ข ค", "3-8:/กขค*", "ขนมครก, คณะลูกขุน, คุกเข่า, ..."],
    ["มีอย่างน้อย 12 ตัวอักษร และมี ปลา", "12-:*ปลา*", "กระต่ายแก่แม่ปลาช่อน, ..."],
    ["มี 7 ตัวอักษร มี ม อยู่ตำแหน่งที่ 3 และมี ส ะ", "7:..ม* & /สะ*", "สามัตถิยะ, เหมาะสม, อัสมิมานะ"],
    ["มี 11 ตัวอักษร และไม่มีสระในบรรทัด", "11:/* & ^ใเแโไาำะฤา", "กล้องจุลทรรศน์, ..."],
    ["มี ฮ แต่ไม่ได้ขึ้นต้นด้วย ฮ", "/*ฮ & !ฮ*", "เก๊กฮวย, นกฮูก, เฮ, ..."]
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
      letter = ""
      queryResults = search(query, includeWiki)

      allFirstLetters = []
      if(queryResults.results.length == 0)
        return
      let latest = getFirstLetter(queryResults.results[0])
      allFirstLetters.push(latest)
      
      for(var w of queryResults.results) {
        if(getFirstLetter(w) != latest) {
          latest = getFirstLetter(w)
          allFirstLetters.push(latest)
        }
      }
    }
  }
</script>

<Head {title} {description} {url} {imageUrl} {gtagId} />


<div class="flex flex-col justify-items-center text-center gap-2">
  <h1 class="text-md lg:text-5xl font-extrabold mb-2">TH Wordle Search</h1>
  <div class="flex flex-row justify-center gap-2">
    <input
      type="text"
      class="input input-bordered input-sm lg:input-md lg:text-xl"
      on:keypress={onKeypress}
      bind:value={input}
      placeholder="พิมพ์รูปแบบที่นี่"
    />
    <button on:click={submit} class="btn btn-sm lg:btn-md btn-primary">
      หา
    </button>
    <button on:click={()=>query=""} class="btn btn-sm lg:btn-md btn-secondary">
      วิธีใช้
    </button> 
    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">รวมหัวข้อใน wikipedia</span>
        <input type="checkbox" class="checkbox" bind:checked={includeWiki}/>
      </label>
    </div>
  </div>

  <div class="overflow-x-auto mx-auto">
    {#if query}
      {#if filteredResults.length > 0}
        <div class="btn-group justify-center my-4">
          {#each Array(Math.floor(filteredResults.length/100)+1) as _, idx}
            <button class="btn btn-sm {idx == start/100 ? 'btn-accent': ''}" name="pageButtons" on:click={()=>{
              start=idx*100;
              window.scrollTo(0, 0)
            }}>
              {idx+1}
            </button> 
          {/each}
        </div>
        <div class="btn-group justify-center my-4">
          {#each allFirstLetters as a}
            <button class="btn btn-sm {a == letter ? 'btn-accent': ''} text-lg font-thin" name="pageButtons" on:click={()=>{
              letter = letter == a? "": a;
              start = 0;
              window.scrollTo(0, 0)
            }}>
              {a}
            </button> 
          {/each}
        </div>
        <span>แสดงผลลัพธ์หน้าที่ {start/100 + 1} ({start+1} ถึง {Math.min(start+100, queryResults.count)}) จาก {queryResults.count} คำ</span><br>
        {#each currentQueryResults as qr}
          <div data-tip="copy" class="tooltip">
            <button class="btn btn-outline btn-sm lg:btn-md lg:text-xl font-thin m-0.5" on:click={()=>
              navigator.clipboard.writeText(qr)
            }>{qr}</button>
          </div>
        {/each}
        <div class="btn-group justify-center my-4">
          {#each Array(Math.floor(filteredResults.length/100)+1) as _, idx}
            <button class="btn btn-sm {idx == start/100 ? 'btn-accent': ''}" name="pageButtons" on:click={()=>{
              start=idx*100;
              window.scrollTo(0, 0)
            }}>
              {idx+1}
            </button> 
          {/each}
        </div>
      {:else}
        <span>ไม่เจอรูปแบบ </span> <span class="text-red-400"> {query} </span> <span>ลองใหม่นะ</span>
      {/if}
    {:else}
      <table class="table table-compact table-zebra w-full lg:table-normal hidden lg:block">
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
              <button class='btn btn-info btn-block font-thin text-xl' on:click={()=>input=ip}>{ip}</button>
              </div></td>
            <td>{result}</td>
          </tr>
          {/each}
        </tbody>
      </table>
      <table class="table table-compact table-zebra w-48 lg:hidden">
        <thead>
          <tr>
            <th>ถ้าอยากหาคำที่...ให้ใส่...</th>
          </tr>
        </thead>
        <tbody>
          
          {#each examples as [desc, ip, result]}
            <tr>
              <td>
                <p>{desc}</p>
                <div data-tip="ลองเลย" class="tooltip">
                  <button class='btn btn-info btn-xs text-sm' on:click={()=>input=ip}>{ip}</button>
                </div>
                <br>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<footer class="p-4 footer bg-base-300 text-base-content footer-center">
  <div class="flex flex-row justify-center">
    <a href="https://github.com/lemononmars/thwordsearch" target="_blank" class="link link-primary">Github</a>
    <a href="https://twitter.com/SakulbuthE" target="_blank" class="link link-primary">เสนอแนะ/แจ้งบัค</a>
  <Social {url} {title} {description}/>
  </div>
</footer>