const newspapers = require('./newsplatfroms');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;
const articles = [];

newspapers.forEach(newspaper =>{
    axios.get(newspaper.link)
    .then(response =>{
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const address = $(this).attr('href');

            articles.push({
                name: newspaper.name,
                title,
                address
            })
        })
    })
    .catch(err =>{
        console.log("Error: " + err);
    })
})

app.get('/', (req, res)=>{
    res.json(articles);
})

app.get('/news', (req, res)=>{
    res.send(`
    <body>
        <h1>Welcome Word!</h1>
        <button><a href="http://localhost:3000/news/dailynews">Single News</a></button>
    </body>
    `)
})

app.get('/news/:name', (req, res)=>{
    const newspaperName = newspapers.filter(newspaper =>newspaper.name === req.params.name)[0].link;

    axios.get(newspaperName)
    .then(response =>{
        const html = response.data;
        const $ = cheerio.load(html);
        console.log(html);
        const specificArticle = [];

        $('a:contains("climate")', html).each(function(){
            const title = $(this).text();
            const address = $(this).attr('href');

            specificArticle.push({
                name: newspapers.name,
                title, 
                address
            })
            console.log(specificArticle)
        })
        res.json(specificArticle);
    })
    .catch(err =>{
        console.log("Error: " + err);
    })
})

app.listen(port, ()=>{
    console.log("Server is listening on port " + port);
})