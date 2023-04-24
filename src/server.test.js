import async from "regenerator-runtime";
import sinon from "sinon";
import request from "supertest";
import db from "./db";
import { app } from "./server";
import { expect } from "chai";

describe('GET /users/:username', () => {
    it('send correct response when a user with the username is found', async () => {
        const fakeData = [{
            id: '123',
            username: 'abc',
            email: 'abc@gmail.com',
        }];

        //create test double for api call 'getUserByUsername' and force the result to be fakedata
        const stub = sinon
            .stub(db, 'getUserByUsername')
            .resolves(fakeData)

        //call api endpoint with arugment abc, and expect the status code to be 200 with a content type of json and resolve with the fakedata
        await request(app).get('/users/abc')
            .expect(200)
            .expect('Content-Type', /json/)
            .expect(fakeData)

        //On the first call of the stub, we expect the argument passed to be 'abc'
        expect(stub.getCall(0).args[0]).to.equal('abc')
        stub.restore()
    });

    it('sends the correct response when there is an error', async () => {
        const fakeError = {
            status: 500
        }
        const stub = sinon.stub(db, 'getUserByUsername')
            .throws(fakeError)

        await request(app).get('/users/abc')
            .expect(500)
            .expect('Content-Type', /json/)
            .expect('"Internal Server Error"')

        stub.restore()
    });

    it('returns the appropriate response when the user is not found', async () => {
        const fakeError = {
            status: 404
        }
        //could instead use .resolves(null) than .throws since we know this is how it should behave
        const stub = sinon.stub(db, 'getUserByUsername')
            .throws(fakeError)

        await request(app).get('/users/badUser')
            .expect(404)
            .expect('Content-Type', /json/)
            .expect('')

        stub.restore()
    });
})