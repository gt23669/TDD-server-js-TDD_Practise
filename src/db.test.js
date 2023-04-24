import { expect } from 'chai';
import { getUserByUsername } from './db';
import { getDatabaseData, resetDatabase, setDatabaseData } from './test-helpers';
import { afterEach } from 'mocha';
import { async } from 'regenerator-runtime';

describe('getUserByUsername', () => {
    let fakeData = [];
    beforeEach('Setup db', async () => {
        fakeData = [{
            id: '123',
            username: 'abc',
            email: 'abc@gmail.com',
        }, {
            id: '124',
            username: 'wrong',
            email: 'wrong@wrong.com',
        }];

        await setDatabaseData('users', fakeData)
    })

    afterEach('dont forget to reset the db', async () => {
        await resetDatabase()
    })

    it('get the correct user from the database given a username', async () => {
        const expected = {
            id: '123',
            username: 'abc',
            email: 'abc@gmail.com',
        };

        const actual = await getUserByUsername('abc');
        //verify db state is intact
        const finalDBState = await getDatabaseData('users')

        expect(actual).excludingEvery('_id').to.deep.equal(expected);
        expect(finalDBState).excludingEvery('_id').to.deep.equal(fakeData);
    });

    it('returns null when user is not found', async () => {
        const expected = {}
        const actual = await getUserByUsername('badUser')

        expect(actual).to.be.null
    })
});