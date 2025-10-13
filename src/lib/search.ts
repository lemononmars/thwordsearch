import dict from '$lib/dict.json'
import wiki from '$lib/wiki.json'

export function splitWord(word: string) {
  const alphas = word.split("")
  const out: string[] = []

  alphas.forEach((a) => {
    if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/) || a.match(/[\.\*\/\[\]]/)) {
      out.push(a)
    } else {
      out[out.length - 1] += a
    }
  })

  return out
}

export function wordLength(word: string) {
  return word.replace(/[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]/g, "").length
}

export function getFirstLetter(word: string) {
  for(var l of word.split(""))
    if(l.match(/[ก-ฮ]/)) return l
  return ""
}

function removeSymbols(word: string) {
  return word.replace(/[\*\.\/\&\|\^\[\]]/g, "")
}

export function search(query: string, includeWiki: boolean) {
  if(!query)
    return {valid: false, count:0, results: []}

  let andMode = query.includes('&')
  let queries = query.split(/[\&\|]/).map((q)=>
    q.trim()
    .replace(/[\*]{2,}/g, "*") // replace multiple * with a single *
    .replace(/\*\./g, ".*") // replace substring *. with .* for slight speedup 
  )

  let excluded: string[] = []
  let excludedQuery = queries.filter((q)=>q.includes("^"))
  excludedQuery.forEach((eq)=> 
    excluded = excluded.concat(splitWord(removeSymbols(eq)))
  )
  queries = queries.filter((q)=>!q.includes("^"))
  // special case: if the user only inputs exclusion string, we search for all strings!
  if(excluded.length > 0 && queries.length == 0)
    queries = ['*']

  let minLength = 0
  let maxLength = 100
  let lengthQuery = queries.find((q)=>q.includes(":")) // only the first length query is used
  if(lengthQuery) {
    let lengthStr = lengthQuery.slice(0, lengthQuery.indexOf(":"))

    // a single number - exact match
    if(!lengthStr.includes("-"))
      lengthStr += "-" + lengthStr
    const minStr = lengthStr.slice(0, lengthStr.indexOf("-"))
    const maxStr = lengthStr.slice(lengthStr.indexOf("-")+1)
    if(minStr.length > 0)
      minLength = parseInt(minStr)
    if(maxStr.length > 0)
      maxLength = parseInt(maxStr)
  }
  
  let results: string[] = []
  // check each word against all queries
  dict.forEach((w)=>{
    const len = wordLength(w)
    if(len < minLength || len > maxLength) return
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

  if(includeWiki) {
    (wiki as string[]).forEach((w: string)=>{
      const len = wordLength(w)
      if(len < minLength || len > maxLength) return
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
        if(!results.includes(w))
          results = [...results, w]
    })
  }

  // sort locale Thai
  results = results.sort((a,b)=>a.localeCompare(b, 'th'))
  return {
    valid: true,
    count: results.length, 
    results: results
  }
}

function matchQuery(w: string, q: string, e:string[]):boolean{
  // return if the word has any excluded character
  if(e.some((ec)=>w.includes(ec))) return false

  const wordSplitted = splitWord(w)
  let querySplitted = splitWord(q)

  if(q.includes(":"))
    q = q.slice(q.indexOf(":")+1)
  
  let mode = {anagram: false, subset: false}
  const numWilds = querySplitted.reduce((prev, letter) => prev + (letter === '.'? 1:0), 0)
  const numFillers = querySplitted.reduce((prev, letter) => prev + (letter === '*'? 1:0), 0)

  if(querySplitted[0] === '/') mode.anagram = true
  if(q.includes("{")) mode.subset = true
  
  // Type 1: Anagram
  if(mode.anagram) {
    querySplitted = splitWord(removeSymbols(q))

    // first, check if their lenghts match
    if(numFillers == 0 && wordSplitted.length != querySplitted.length + numWilds) return false
    if(numFillers > 0 && wordSplitted.length < querySplitted.length + numWilds) return false

    let numMatches = 0
    for(const qIndex in querySplitted)
      for(const wIndex in wordSplitted)
        if(wordSplitted[wIndex] && wordSplitted[wIndex].startsWith(querySplitted[qIndex])) {
          wordSplitted[wIndex] = ''
          numMatches ++
          break
        }
      
    // return if not all query letters match
    if(numMatches < querySplitted.length) return false
    return true
  }

  // Type 2: Subset
  // {abc} check if every letter in the word is in the set
  // {abc}+3 means up to 3 letters can be outside the subset
  if(mode.subset) {
    let subsetStart = q.indexOf("{")
    let subsetEnd = q.indexOf("}")
    if(subsetStart < 0 || subsetEnd < 0 || subsetEnd <= subsetStart) return false
    let subset = q.slice(subsetStart+1, subsetEnd).split("")
    let extra = q.slice(q.indexOf("}")+1)
    let allowedExtra = 0
    if(extra.length > 0 && extra[0] === "+")
        allowedExtra = parseInt(extra.slice(1)) || 0
    let numOutside = 0
    for(const wIndex in wordSplitted)
      if(!subset.some((s)=>wordSplitted[wIndex].startsWith(s)))
        numOutside ++
        if(numOutside > allowedExtra) return false
    return true
  }

  // Type 3: No anagram or subset - normal matching
  if(!mode.anagram) {
    let qIndex = 0, wIndex = 0
    while(qIndex < querySplitted.length && wIndex < wordSplitted.length){
      if(querySplitted[qIndex] === "*"){
        qIndex ++
        // if * was the last character, it's done!
        if(qIndex == querySplitted.length)
          return true
        // otherwise, find the next matching character and recursively check the rest
        while(wIndex < wordSplitted.length) {
          if(querySplitted[qIndex] === "." || wordSplitted[wIndex].startsWith(querySplitted[qIndex]))
            if(matchQuery(wordSplitted.slice(wIndex).join(""), querySplitted.slice(qIndex).join(""), e))
              return true
          wIndex ++
        }
        if(wIndex >= wordSplitted.length) return false
      }
      // letter: must match
      // wild: increment
      else if(querySplitted[qIndex] === "." || wordSplitted[wIndex].startsWith(querySplitted[qIndex])) {
        qIndex ++
        wIndex ++
      }
      // [abc]: any character matches
      else if (querySplitted[qIndex] === "[") {
        // find closing ]
        let closingIndex = qIndex+1
        while(closingIndex < querySplitted.length && querySplitted[closingIndex] !== "]")
          closingIndex ++
        if(closingIndex == querySplitted.length) return false // no closing ]
        // check if any character in the [] matches
        let found = false
        for(let i = qIndex+1; i < closingIndex; i++)
          if(wordSplitted[wIndex].startsWith(querySplitted[i])) {
            found = true
            break
          }
        if(found) {
          qIndex = closingIndex + 1
          wIndex ++
        }
        else
          return false
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