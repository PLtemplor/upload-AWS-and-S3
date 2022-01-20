const express = require('express')
    const bodyParser = require('body-parser')
    const multer = require('multer')
    
    const app = express()
    
    const multerMid = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    })
    
    app.disable('x-powered-by')
    app.use(multerMid.single('file'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))
    
    app.post('/uploads', (req, res, next) => {
    })
    
    app.listen(9001, () => {
      console.log('app now listening for requests!!!')
    })