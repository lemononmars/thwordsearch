# Word Search in Thai language
THwordle Search is a pattern-matching word-search tool for puzzle solving and construction, akin to [QAT](https://www.quinapalus.com/cgi-bin/qat) or [Nutrimatic](https://nutrimatic.org/).

## Feature
- Support basic patterns
* `.` for a single wild character
* `/` for anagram
* `*` for any number of wild characters (including zero)
* `#-#:` for max and min string length
* `&` and '|' for multiple queries
* `^` for exclusion (to be used alone)
- Additional vocabs from [thwikitionary](https://dumps.wikimedia.your.org/thwiktionary/20220120/) and [Lexitron](https://lexitron.nectec.or.th/2009_1/)

## To do
- [ ] Add more advanced patterns (ideally, all of [these](https://www.quinapalus.com/qat.html))
- [x] Use a better dictionary 
- [ ] Remove bad words from the dictionary
- [ ] Add interesting dictionary

## Resources
- [sveltekit-typescript-postcss-tailwind2](https://github.com/dansvel/sveltekit-typescript-postcss-tailwind2) for head start
- [daisyUI](https://daisyui.com/) for styling
