import ghpages from 'gh-pages'

ghpages.publish(
    'build',
    {
        branch: 'gh-pages',
        repo: 'https://github.com/lemononmars/thwordsearch.git',
        user: {
            name: 'lemononmars',
            email: 'sakulbuth@gmail.com'
        },
        nojekyll: true,
    },
    () => {
        console.log('Deploy Complete!')
    }
)