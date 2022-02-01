import dict from '$lib/dict.json'
//import dict from '$lib/dictsm.json'

export function splitWord(word: string) {
  const alphas = word.split("")
  const out = []

  alphas.forEach((a) => {
    if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/) || a.match(/[\.\*\/]/)) {
      out.push(a)
    } else {
      out[out.length - 1] += a
    }
  })

  return out
}

function isUpperOrLowerCharacter(char: string): boolean {
  return !char.match(/[ก-ฮ]/) && !char.match(/[ใเแโไาำะๆฯฤา]/)
}

function removeSymbols(word: string) {
  return word.replace(/[\*\.\/\&\|\^\[\]]/g, "")
}

export function search(query: string) {
  // TODO: also check weird input (like several /, or / with multiple *)
  if(!query)
    return {valid: false, count:0, results: []}

  let andMode = query.includes('&')
  let queries = query.split(/[\&\|]/).map((q)=>q.trim())

  let excluded = []
  let excludedQuery = queries.filter((q)=>q.includes("^"))
  excludedQuery.forEach((eq)=> 
    excluded = excluded.concat(splitWord(removeSymbols(eq)))
  )
  queries = queries.filter((q)=>!q.includes("^"))
  // special case: if the user only inputs exclusion string, we search for all strings!
  if(excluded.length > 0 && queries.length == 0)
    queries = ['*']
  
  let results = []
  // check each word against all queries
  dict.forEach((w)=>{
    let matchedQuery = 0
    queries.forEach((q)=>{
      var result = matchQuery(w,q,excluded)
      result = q.includes("!")? !result: result
      matchedQuery += result?1:0
    })
    if(
      (andMode && matchedQuery === queries.length)
      || (!andMode && matchedQuery > 0)
    )
      results = [...results, w]
  })

  return {
    valid: true,
    count: results.length, 
    results: results
  }
}

function matchQuery(w: string, q: string, e:string[]):boolean{
  // return if the word has any excluded character
  if(e.some((ec)=>w.includes(ec))) return false

  // ignore negation (!) and only check after returned
  q = q.replace(/[\!]/g, "")
  const wordSplitted = splitWord(w)
  let querySplitted = splitWord(q)

  // length
  let minLength = 0
  let maxLength = 100
  if(q.includes(":")) {
    let lengthStr = q.slice(0, q.indexOf(":"))
    q = q.slice(q.indexOf(":")+1)

    // a single number - exact match
    if(!lengthStr.includes(":"))
      lengthStr += ":" + lengthStr
    const minStr = lengthStr.slice(0, lengthStr.indexOf("-"))
    const maxStr = lengthStr.slice(lengthStr.indexOf("-")+1)
    if(minStr.length > 0)
      minLength = parseInt(minStr)
    if(maxStr.length > 0)
      maxLength = parseInt(maxStr)
  }
  
  let mode = {wild: false, anagram: false, filler: false}
  const numWilds = querySplitted.reduce((prev, letter) => prev + (letter === '.'? 1:0), 0)
  const numFillers = querySplitted.reduce((prev, letter) => prev + (letter === '*'? 1:0), 0)

  if(querySplitted[0] === '/') mode.anagram = true

  // Type 1: Anagram
  if(mode.anagram) {
    querySplitted = splitWord(removeSymbols(q))
    if(wordSplitted.length < minLength || wordSplitted.length > maxLength) return false

    // first, check if their lenghts match
    if(numFillers == 0 && wordSplitted.length != querySplitted.length + numWilds) return false
    if(numFillers > 0 && wordSplitted.length < querySplitted.length + numWilds) return false

    let numMatches = 0
    for(const qIndex in querySplitted)
      for(const wIndex in wordSplitted)
        if(wordSplitted[wIndex] && wordSplitted[wIndex].startsWith(querySplitted[qIndex])) {
          wordSplitted[wIndex] = null
          numMatches ++
          break
        }
      
    // return if not all query letters match
    if(numMatches < querySplitted.length) return false
  }

  // Type 2: No anagram
  if(!mode.anagram) {
    if(wordSplitted.length < minLength || wordSplitted.length > maxLength) return false

    let qIndex = 0, wIndex = 0
    while(qIndex < querySplitted.length && wIndex < wordSplitted.length){
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
          if(wIndex >= wordSplitted.length) return false
        }
      }
      // letter: must match
      // wild: increment
      else if(querySplitted[qIndex] === "." || wordSplitted[wIndex].startsWith(querySplitted[qIndex])) {
        qIndex ++
        wIndex ++
      }
      else
        return false
    }

    //special case: * is at the end of query string
    // w = ABC
    // q = ABC*
    // here, w finishes earlier, but it should be matched to q
    if(wIndex == wordSplitted.length && qIndex == querySplitted.length-1 && querySplitted[qIndex] === "*")
      return true
    if(qIndex < querySplitted.length || wIndex < wordSplitted.length) 
      return false
  }
  return true
}