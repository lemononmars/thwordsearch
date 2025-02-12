import fs from 'fs'

fs.readFile('./daily.json', 'utf8', (err, jsonString) => {

   const words = JSON.parse(jsonString)
   fs.writeFile('./daily.json', JSON.stringify(shuffle(words)), err=>{})
})

function shuffle(s) {
   const l = s.length
   for(let i = 0; i < l; i ++) {
      const newIndex = Math.floor(Math.random()*(l-i-1))
      const temp = s[newIndex]
      s[newIndex] = s[i]
      s[i] = temp
   }

   return [...s]
}
