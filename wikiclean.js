import fs from 'fs'
import { toUnicode } from 'punycode'

fs.readFile('./wiki.txt', 'utf16le', (err, jsonString) => {
  
  let words = jsonString.split('\r\n')
  words = words.map((w) => removeSymbols(w))
  let thwords = []
  words.forEach((w) => {
    if(w === '' || w.includes("แก้ความกำกวม") || w.replace(/[0-9.]/g, '') === '')
      return
    thwords.push(w)
  })
  fs.writeFile('./wiki.json', JSON.stringify(thwords), err=>{})
})

function isUpperOrLowerCharacter(char) {
   return !char.match(/[ก-ฮ]/) && !char.match(/[ใเแโไาำะๆฯฤา]/)
 }
 
 function removeSymbols(word) {
   return word.replace(/[^\u0E00-\u0E7F0-9.]/g, '')
 }

 