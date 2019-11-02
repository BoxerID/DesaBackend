import atob from 'atob'
import { ADMINISTRATOR } from './permission'
import _ from 'lodash'

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

    _buildQuery(query) {
        const re = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3}|\d{6})Z/;
        for (var key in query) {
            if (typeof query[key] === 'string' && re.test(query[key])) {
                query[key] = new Date(query[key])
            } else if (query[key] instanceof Object) {
                query[key] = this._buildQuery(query[key])
            }
        }
        return query
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
                console.log(val)
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
            const v = this.model.updateOne({ _id: req.params.id }, { name: req.body.name })
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
        const filter = req.query.base64filter ? this._buildQuery(JSON.parse(atob(req.query.base64filter))) : {}
        //console.log(this._buildSort(req.query.sort));
        const sort = req.query.sort ? this._buildSort(req.query.sort) : {}
        try {
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