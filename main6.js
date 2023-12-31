const express = require('express')
const fs = require('fs')
const qs = require('querystring')
const app = express()
const port = 3000
const template = require('./lib/template.js')
app.get('/', (req, res)=>{
    let {name} = req.query
    fs.readdir('page', (err, files)=>{
        let list = template.list(files)
        fs.readFile(`page/${name}`, 'utf8', (err,data)=>{
            let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>`
            if(name === undefined){
                name = 'Hello'
                data = 'World'
                control = `<a href="/create">create</a>`
            }
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control)
            res.send(html)
        })
    })
})
app.get('/create', (req, res)=>{
    fs.readdir('page', (err, files)=>{
        const name = 'create'
        const list = template.list(filse)
        const data = template.create()
        const html = template.HTML(name, list, data, '')
        res.send(html)
    })
})
app.get('/update', (req, res)=>{
    let {name} = req.query
    fs.readdir('page', (err, files)=>{
        let list = template.list(files)
        fs.readFile(`page/${name}`, 'utf8', (err,content)=>{
            let control = `<a href="/create">create</a> <a href="/update?name=${name}">update</a>`
            const data = template.update(name, content)
            const html = template.HTML(name, list, `<h2>${name} 페이지</h2><p>${data}</p>`, control)
            res.send(html)
        })
    })
})
app.post('/create_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const title = post.title
        const decription = post.decription
        fs.writeFile(`page/${title}`, decription, 'utf8', (err)=>{
            res.redirect(302, `/?name=${title}`)
        })
    })
})
app.post('/update_process', (req, res)=>{
    let body = ''
    req.on('data', (data)=>{
        body = body + data
    })
    req.on('end', ()=>{
        const post = qs.parse(body)
        const id = post.id
        const title = post.title
        const decription = post.decription
        fs.rename(`page/${id}`, `page/${title}`, (err)=>{
            fs.writeFile(`page/${title}`, decription, 'utf8', (err)=>{
                res.redirect(302, `/?name=${title}`)
            })
        })
    })
})
app.listen(port, ()=>{
    console.log(`server running on port ${port}`)
})