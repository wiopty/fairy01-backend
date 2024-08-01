import express, {Request, Response} from 'express'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from './types'
import { CreateKierunekModel } from './models/createKierunekModel'
import { UpdateKierunekModel } from './models/updateKierunekModel'
import { KierunekQueryModel } from './models/getKierunekQueryModel'
import { KierunkiViewModel} from './models/KierunkiViewModel'
import { URIParamsIdKierunekModel } from './models/URIParamsIdKierunekModel'
import { title } from 'process'
export const app = express()
const port = 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type KierunkiTYpe = {
  id: number
  title: string
}
const db: {kierunki: KierunkiTYpe[]} = {
  kierunki: [
    { id: 1, title: 'informatyka' },
    { id: 2, title: 'inżynieria multimediów' },
    { id: 3, title: 'elektrotechnika' },
    { id: 4, title: 'IZI' }
  ]
}
app.get('/', (req, res) => {
  res.json('Hi there')
})


const geKierunekViewModel = (dbKierunek: KierunkiTYpe): KierunkiViewModel => {
  return {
    id: dbKierunek.id,
    title: dbKierunek.title
  }
}
app.get('/kierunki', (req: RequestWithQuery<KierunekQueryModel>, 
                      res: Response<KierunkiViewModel[]>) => {
  let foundCourses = db.kierunki;
  if (req.query.title) {
    foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1)

  }

  res.json(foundCourses.map(geKierunekViewModel))
})

app.get('/kierunki/:id', (req: RequestWithParams<URIParamsIdKierunekModel>, 
                          res: Response<KierunkiViewModel>) => {
  const foundKierunek = db.kierunki.find(c => c.id === +req.params.id)
  if (!foundKierunek) {
    res.sendStatus(404);
    return;
  }
  res.json(geKierunekViewModel(foundKierunek))
})

app.post('/kierunki', (req: RequestWithBody<CreateKierunekModel>,
                      res: Response<KierunkiViewModel>) => {
  if(!req.body.title) {
    res.sendStatus(400)
    return;

  }
  
  const createdKierunek = {
    id: +(new Date()), //в id записує рандомну дату
    title: req.body.title
  }
  db.kierunki.push(createdKierunek)
  console.log(createdKierunek)
  res
    .status(201)  
    .json(geKierunekViewModel(createdKierunek))
})

app.delete('/kierunki/:id', (req: RequestWithParams<URIParamsIdKierunekModel>, res) => {
  db.kierunki = db.kierunki.filter(c => c.id !== +req.params.id)
  res.sendStatus(204)
})

app.put('/kierunki/:id', (req: RequestWithParamsAndBody<URIParamsIdKierunekModel,UpdateKierunekModel>, res) => {
  if (!req.body.title) {
    res.sendStatus(400);
    return;
  }

  const foundKierunek = db.kierunki.find(c => c.id === +req.params.id)
  if (!foundKierunek) {
    res.sendStatus(400);
    return;
  }
  foundKierunek.title = req.body.title
  res.sendStatus(204)
})

app.get('/kierunki/:id', (req: RequestWithQuery<{title: string}>, 
                          res: Response<KierunkiViewModel[]>) => {
  if(req.query.title) {
    let searchString = req.query.title.toString()
    res.send(db.kierunki.filter(c => c.title.indexOf(searchString) > -1))
  }else {
    res.send(db.kierunki)
  }
})



app.delete('/__test__/data', (req,res) => {
  db.kierunki = []
  res.sendStatus(204)
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})