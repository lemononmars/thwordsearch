import fs from 'fs'

fs.readFile('./dict.json', 'utf8', (err, jsonString) => {

   const dict = JSON.parse(jsonString)
   const wordLength = 7
   const NLetterWords = dict.filter((w)=> w.length == wordLength  && !w.includes('การ') && !w.includes('ความ'))
   console.log('there are ', NLetterWords.length, ' words to play with.')

   let results = []
   let id = 1
   for(const solution of NLetterWords) {
      const set = new Set(solution)
      if(set.size < wordLength)
         continue

      let object = {
         id,
         word: solution
      }
      results = [...results, object]
      id ++
      if(id%100 == 0)
         console.log('at ', id, 'words')
   }
   console.log('Found ', results.length, ' pangrams of ', wordLength, ' letters.')

   fs.writeFile(`./spellingbee${wordLength}letters.json`, JSON.stringify(results), err=>{})
})

export function splitWord(word) {
   const alphas = word.split("")
   const out = []
 
   alphas.forEach((a) => {
     if (a.match(/[ก-ฮ]/) || a.match(/[ใเแโไาำะๆฯฤา]/))
       out.push(a)
   })
 
   return out
 }
