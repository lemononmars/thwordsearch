import fs from 'fs'

fs.readFile('./src/lib/basedict.json', 'utf8', (err, jsonString) => {

   const wordLength = 8
   const NLetterWords = JSON.parse(jsonString).filter((w)=> splitWord(w).length == wordLength && !w.includes('การ') && !w.includes('ความ'))
   const totalWords = NLetterWords.length
   console.log("There are ", totalWords, " words of length ", wordLength)
   const validationLetter = ["W","D","C"] 
   let patterns = []

   for(let i = 0; i < wordLength; i ++)
      patterns = exponentiate(patterns)
   //console.log(patterns)

   let searchResult = []
   for(const solution of NLetterWords) {
   //for(let i = 0; i < 10; i ++){ let solution = NLetterWords[i]
      let counts = patterns.map((p)=>0)
      let splittedSolution = splitWord(solution)
      NLetterWords.forEach((search)=>{
         let splittedSearch = splitWord(search)
         let result = new Array(wordLength).fill(0)
         // first pass: correct
         splittedSolution.forEach((s,idx)=> {
            if(s === splittedSearch[idx]) {
               result[idx] = 2
               splittedSearch[idx] = null
            }
         })
         // second pass: displaced
         splittedSolution.forEach((s,idx)=>{
            if( result[idx]== 2) return
            const found = splittedSearch.findIndex((w)=> w === s)
            if( found > 0) {
               splittedSearch[found] = null
               result[idx] = 1
            }
         })
         const resultString = result.reduce((str, r)=> str + validationLetter[r], "")
         counts[patterns.findIndex((w)=> w === resultString)] ++
      })
      const nonemptyCounts = counts.filter((c)=>c > 0)
      const entropy = nonemptyCounts.reduce((total, c)=> total + c * Math.log2(totalWords/c), 0)
      searchResult = [...searchResult, {word: solution, entropy: entropy/totalWords}]
   }
   searchResult = searchResult.sort((a,b) => b.entropy - a.entropy)

   fs.writeFile(`./entropy${wordLength}.json`, JSON.stringify(searchResult), err=>{})
})

export function splitWord(word) {
   const alphas = word.split("")
   const out = []
 
   alphas.forEach((a) => {
     //if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/))
       out.push(a)
   })
 
   return out
 }

function exponentiate(s){
   const validate = ["W","D","C"] // Wrong, Displaced, Correct
   if(s.length == 0)
      return validate

   let newArray = []
   for(let i = 0; i < s.length; i ++)
      for(let j = 0; j < 3; j ++)
         newArray = [...newArray, s[i] + validate[j]]
   return newArray
}

