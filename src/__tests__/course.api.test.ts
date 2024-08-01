import request from 'supertest'
import { app } from '..'
import { title } from 'process'
import { CreateKierunekModel } from '../models/createKierunekModel'

describe('/kierunki', () => {

    beforeAll( async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 and empty array', async () =>{
        await request(app)
        .get('/kierunki')
        .expect(200, [])
    })

    it('should return 404 for not exiting kierunek', async () =>{
        await request(app)
        .get('/kierunki/999999999999')
        .expect(404)
    })

    it('shouldnt create kierunek with correct input data', async () => {
        const data: CreateKierunekModel = {title: ''}
        await request(app)
        .post('/kierunki')
        .send(data)
        .expect(400)

    })

    let createdKierunek: any = null
    it('should create kierunek with correct input data', async () => {
        const data: CreateKierunekModel = {title: 'Mechatronika'}
        
        const createResponse = await request(app)
        .post('/kierunki')
        .send(data)
        .expect(201)


        createdKierunek = createResponse.body

        expect(createdKierunek).toEqual({
            id: expect.any(Number),
            title: 'Mechatronika'
        })

        await request(app)
        .get('/kierunki')
        .expect(200, createdKierunek)
    })

    it('shouldnt update that dont exist', async () => {
        await request(app)
        .put('/kierunki' + 3)
        .send({ title: 'lalala'})
        .expect(404)
    })

})