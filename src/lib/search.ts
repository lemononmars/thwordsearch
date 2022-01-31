import dict from '$lib/dict.json'
//import dict from '$lib/dictsm.json'

export function splitWord(word: string) {
  const alphas = word.split("")
  const out = []

  alphas.forEach((a) => {
    // ถ้าตัวอักษรเป็นตัวตรงกลาง ให้ถือเป็นตัวใหม่
    if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/) || a.match(/[\.\*\/]/)) {
      out.push(a)
    } else {
      // ถ้าเป็นสระบนล่าง หรือวรรณยุกต์ ให้ต่อท้ายตัวเดิม
      out[out.length - 1] += a
    }
  })

  return out
}

function isUpperOrLowerCharacter(char: string): boolean {
  return !char.match(/[ก-ฮ]/) && !char.match(/[ใเแโไาำะๆฯฤา]/)
}

function removeSymbols(word: string) {
  return word.replace(/[\*\.\/]/g, "")
}

export function search(query: string) {
  // TODO: also check weird input (like several /, or / with multiple *)
  if(!query)
    return {valid: false, numMatches:0, results: []}

  query = query.replace(/\*\*/g, "\*")

  let querySplitted = splitWord(query)
  let results = []
  let debugs = []

  let count = 0
  let mode = {wild: false, anagram: false, filler: false}
  const numWilds = querySplitted.reduce((prev, letter) => prev + (letter === '.'? 1:0), 0)
  const numFillers = querySplitted.reduce((prev, letter) => prev + (letter === '*'? 1:0), 0)

  if(querySplitted[0] === '/') mode.anagram = true
  if(querySplitted.includes("*")) mode.filler = true
  if(querySplitted.includes(".")) mode.wild = true

  // Type 1: Anagram
  if(mode.anagram) {
    querySplitted = splitWord(removeSymbols(query))

    dict.forEach((w)=>{
      const wordSplitted = splitWord(w)
      // first, check if their lenghts match
      if(numFillers == 0 && wordSplitted.length != querySplitted.length + numWilds) return
      if(numFillers > 0 && wordSplitted.length < querySplitted.length + numWilds) return

      let numMatches = 0
      for(const qIndex in querySplitted)
        for(const wIndex in wordSplitted)
          if(wordSplitted[wIndex] && wordSplitted[wIndex].startsWith(querySplitted[qIndex])) {
            wordSplitted[wIndex] = null
            numMatches ++
            break
          }
        
      // return if not all query letters match
      if(numMatches < querySplitted.length) return

      results = [...results, w]
    })
  }

  // Type 2: No anagram
  if(!mode.anagram) {
    dict.forEach((w)=>{
      const wordSplitted = splitWord(w)
      let qIndex = 0, wIndex = 0, broken = false
      while(!broken && qIndex < querySplitted.length && wIndex < wordSplitted.length){
        if(querySplitted[qIndex] === "*"){
          qIndex ++
          // if * was the last character, it's done!
          if(qIndex == querySplitted.length)
            wIndex = wordSplitted.length
          // otherwise, find the next matching character
          if(qIndex != querySplitted.length && querySplitted[qIndex] !== "*"){
          let found = false
            while(!found && wIndex < wordSplitted.length) {
              if(wordSplitted[wIndex].startsWith(querySplitted[qIndex]))
                found = true
              // when found, let the next iteration matches the characters
              else
                wIndex ++
            }
            if(wIndex >= wordSplitted.length)
              broken = true
          }
        }
        // letter: must match
        // wild: increment
        else if(querySplitted[qIndex] === "." || wordSplitted[wIndex].startsWith(querySplitted[qIndex])) {
          qIndex ++
          wIndex ++
        }
        else
          broken = true
      }

      if(broken || qIndex < querySplitted.length || wIndex < wordSplitted.length) return

      results = [...results, w]
    })
  }

  return {
    valid: true,
    count: results.length, 
    results: results
  }
}
