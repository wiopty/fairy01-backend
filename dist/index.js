"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const jsonBodyMiddleware = express_1.default.json();
app.use(jsonBodyMiddleware);
const db = {
    kierunki: [
        { id: 1, title: 'informatyka' },
        { id: 2, title: 'inżynieria multimediów' },
        { id: 3, title: 'elektrotechnika' },
        { id: 4, title: 'IZI' }
    ]
};
app.get('/', (req, res) => {
    res.json('Hi there');
});
app.get('/kierunki', (req, res) => {
    let foundCourses = db.kierunki;
    if (req.query.title) {
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title) > -1);
    }
    res.json(foundCourses);
});
app.get('/kierunki/:id', (req, res) => {
    const foundKierunek = db.kierunki.find(c => c.id === +req.params.id);
    if (!foundKierunek) {
        res.sendStatus(404);
        return;
    }
    res.json(foundKierunek);
});
app.post('/kierunki', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const createdKierunek = {
        id: +(new Date()), //в id записує рандомну дату
        title: req.body.title
    };
    db.kierunki.push(createdKierunek);
    console.log(createdKierunek);
    res
        .status(201)
        .json(createdKierunek);
});
app.delete('/kierunki/:id', (req, res) => {
    db.kierunki = db.kierunki.filter(c => c.id !== +req.params.id);
    res.sendStatus(204);
});
app.put('/kierunki/:id', (req, res) => {
    if (!req.body.title) {
        res.sendStatus(400);
        return;
    }
    const foundKierunek = db.kierunki.find(c => c.id === +req.params.id);
    if (!foundKierunek) {
        res.sendStatus(400);
        return;
    }
    foundKierunek.title = req.body.title;
    res.sendStatus(204);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
