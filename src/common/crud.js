import atob from 'atob'
import { ADMINISTRATOR } from './permission'
import _ from 'lodash'

const queryMap = { eq: '$eq', gte: '$gte', gt: '$gt', lt: '$lt', lte: '$lte', ne: '$ne', in: '$in', nin: '$nin', q: '$regex' }

class Crud {
    /*
    opts: {
        'INSERT': {permissions: [], skip: true},
        'UPDATE': {permissions: [], skip: true},
        'DEL': {permissions: [], skip: true},
        'GET': {permissions: [], skip: true},
        'QUERY': {permissions: [], skip: true},
    }
    */
    constructor(fast, key, model, opts = {}) {
        this.key = key
        this.model = model
        this.options = opts
        this.setup(fast)
    }

    /*
    sample query: filter=[name;;q;;apin][score;;gt;;90]
    */
    _buildQuery(query) {
        const re = /\[\w+;;\w+;;\w*\d*\]/g;
        const dre = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3}|\d{6})Z/;
        const all = query.match(re);
        let q = {};
        _.each(all, v => {
            const arr = v.substring(1, v.length - 1).split(';;')
            if (arr.length === 3) {
                const key = arr[0]
                const op = arr[1]
                let val = arr[2]
                if (op === 'q') {
                    q[key] = { '$regex': new RegExp(val, 'i') }
                } else {
                    if (dre.test(val)) val = new Date(val)
                    q[key] = { [queryMap[op]]: val }
                }
            }
        });
        return q;
    }

    _buildSort(sort) {
        const splits = sort.split(",")
        let s = {}
        for (let i = 0; i < splits.length; i++) {
            const str = splits[i];
            if (str === "") continue;
            const s2 = str.split(":")
            if (s2.length != 2) continue;
            s[s2[0]] = s2[1]
        }
        return s
    }

    _isSkip(key) {
        if (this.options[key] && this.options[key]['skip'] === true) return true;
        return false
    }

    _hasPermission(req, key) {
        const user = req.user;
        if (user.permissions.indexOf(ADMINISTRATOR) >= 0) return true;
        if (this.options[key] && this.options[key]['permissions']) {
            const val = this.options[key]['permissions'];
            if (Array.isArray(val)) {
                _.each(val, v => {
                    if (user.permissions.indexOf(v) >= 0) return true;
                })
                throw "You don't have permission"
            } else if (_.isString(val)) {
                if (user.permissions.indexOf(val) < 0)
                    throw "You don't have permission"
            }
        }
        return true;
    }

    async insert(req, rep) {
        try {
            this._hasPermission(req, 'INSERT');
            const v = await this.model.create({ ...req.body })
            rep.send(v);
        } catch (err) {
            rep.code(400).send({ error: _.isString(err) ? err : err.errors })
        }
    }

    update(req, rep) {
        try {
            this._hasPermission(req, 'UPDATE');
            const v = this.model.updateOne({ _id: req.params.id }, { ...req.body })
            rep.send(v);
        } catch (err) {
            rep.code(400).send({ error: _.isString(err) ? err : err.errors })
        }
    }

    del(req, rep) {
        try {
            this._hasPermission(req, 'DEL');
            const v = this.model.deleteOne({ _id: req.params.id })
            rep.send(v);
        } catch (err) {
            rep.code(400).send({ error: _.isString(err) ? err : err.errors })
        }
    }

    get(req, rep) {
        try {
            this._hasPermission(req, 'GET');
            const v = this.model.findById(req.params.id)
            if (v) rep.send(v)
            else rep.code(400).send({ error: 'Record not found' })
        } catch (err) {
            rep.code(400).send({ error: _.isString(err) ? err : err.errors })
        }
    }

    async query(req, rep) {
        try {
            const filter = req.query.filter ? this._buildQuery(req.query.filter) : {}
            const sort = req.query.sort ? this._buildSort(req.query.sort) : {}
            this._hasPermission(req, 'QUERY');
            const count = await this.model.find(filter).countDocuments();
            const data = await this.model.find(filter).
                limit(req.query.limit ? parseInt(req.query.limit) : 100).
                skip(req.query.skip ? parseInt(req.query.skip) : 0).
                sort(sort);
            rep.send({ data: data, total: count })
        } catch (e) {
            rep.code(400).send({ error: _.isString(e) ? e : e.errors || e.error || e.errmsg })
        }
    }

    setup(fast) {
        if (!this._isSkip('INSERT')) fast.post(`/${this.key}`, this.insert.bind(this))
        if (!this._isSkip('UPDATE')) fast.put(`/${this.key}/:id`, this.update.bind(this))
        if (!this._isSkip('DEL')) fast.delete(`/${this.key}/:id`, this.del.bind(this))
        if (!this._isSkip('GET')) fast.get(`/${this.key}/:id`, this.get.bind(this))
        if (!this._isSkip('QUERY')) fast.get(`/${this.key}`, this.query.bind(this))
    }
}

export default Crud