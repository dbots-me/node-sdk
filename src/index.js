/*jshint esversion: 9 */

const fetch = require('node-fetch');

module.exports = class DbotsMe {

    constructor(token, options = {}) {
        if (!options.endpoint) options.endpoint = "https://api.dbots.me/v1/";

        this.options = {
            token: token,
            ...options
        };
    }

    async _request(method, path, body = {}) {
        const res = await fetch(this.options.endpoint + path, {
            method: method,
            body: method != 'GET' ? JSON.stringify(body) : null,
            headers: {
                'Authorization': `${this.options.token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();

        if (res.status >= 400) throw new Error(data.message);

        return data;
    }


    async getBot(botid) {
        if (typeof botid !== 'string') throw new Error('Bot ID has to be a string');

        return await this._request('GET', `bots/${botid}`);
    }

    async getBotStats(botid) {
        if (typeof botid !== 'string') throw new Error('Bot ID has to be a string');

        return await this._request('GET', `bots/${botid}/stats`);
    }

    async getVotes(botid) {
        if (typeof botid !== 'string') throw new Error('Bot ID has to be a string');

        return await this._request('GET', `bots/${botid}/votes`);
    }

    async getVotesByUser(botid, userid) {
        if (typeof botid !== 'string') throw new Error('Bot ID has to be a string');

        return await this._request('GET', `bots/${botid}/votes/${userid}`);
    }

    async updateBotStats(botid, stats) {
        if (typeof botid !== 'string') throw new Error('Bot ID has to be a string');

        if (typeof stats.server_count !== 'number') throw new Error('server_count has to be an number');
        if (stats.user_count && typeof stats.user_count !== 'number') throw new Error('user_count has to be a number');
        if (stats.voiceconnections_count && typeof stats.voiceconnections_count !== 'number') throw new Error('voiceconnections_count has to be a number');
        if (stats.shards_count && typeof stats.shards_count !== 'number') throw new Error('shards_count has to be a number');
        if (stats.shard_id && typeof stats.shard_id !== 'number') throw new Error('shard_id has to be a number');

        return await this._request('POST', `bots/${botid}/stats`, stats);
    }

    async getUser(userid) {
        if (typeof userid !== 'string') throw new Error('User ID has to be a string'); //snowflake?

        return await this._request('GET', `users/${userid}`);
    }
}