import atob from 'atob'
//import 'babel-polyfill'

class Crud {
    constructor(fast, key, model) {
        this.key = key
        this.model = model
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

    insert(req, rep) {
        this.model.create({ ...req.body }).then(v => {
            rep.send(v);
        }).catch(err => rep.code(400).send({ error: err.errors }));
    }

    update(req, rep) {
        this.model.updateOne({ _id: req.params.id }, { name: req.body.name }).then(v => {
            rep.send(v);
        }).catch(err => rep.code(400).send({ error: err.errors }))
    }

    del(req, rep) {
        this.model.deleteOne({ _id: req.params.id }).then(v => {
            rep.send(v);
        }).catch(err => rep.code(400).send({ error: err.errors }))
    }

    get(req, rep) {
        this.model.findById(req.params.id).then(v => {
            if (v) rep.send(v)
            else rep.code(400).send({ error: 'Record not found' })
        }).catch(err => rep.code(400).send({ error: err.errors || err }))
    }

    async query(req, rep) {
        const filter = req.query.base64filter ? this._buildQuery(JSON.parse(atob(req.query.base64filter))) : {}
        //console.log(this._buildSort(req.query.sort));
        const sort = req.query.sort ? this._buildSort(req.query.sort) : {}
        try {
            const count = await this.model.find(filter).countDocuments();
            const data = await this.model.find(filter).
                limit(req.query.limit ? parseInt(req.query.limit) : 100).
                skip(req.query.skip ? parseInt(req.query.skip) : 0).
                sort(sort);
            rep.send({ data: data, total: count })
        } catch (e) {
            rep.code(400).send({ error: e.errors || e.error || e.errmsg })
        }
    }

    setup(fast) {
        fast.post(`/${this.key}`, this.insert.bind(this))
        fast.put(`/${this.key}/:id`, this.update.bind(this))
        fast.delete(`/${this.key}/:id`, this.del.bind(this))
        fast.get(`/${this.key}/:id`, this.get.bind(this))
        fast.get(`/${this.key}`, this.query.bind(this))
        this.nextSetup(fast)
    }

    nextSetup(fast) { }
}

export default Crud