const restify = require('restify');

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'restserver'
    }
});

const errs = require('restify-errors');

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
});

//rotas

server.get('/', (req, res, next) => {
    knex('rest').then((dados) => {
        res.send(dados);
    }, next)
});

server.post('/create', (req, res, next) => {
    knex('rest').insert(req.body).then((dados) => {
        res.send(dados);
    }, next)
});

server.get('/show/:id', (req, res, next) => {
    const { id } = req.params;

    knex('rest').where('id', id).first().then((dados) => {
        if (!dados) return res.send(new errs.BadRequestError('Nenhum registro encontrado'));
        res.send(dados);
    }, next)
});

server.put('/update/:id', (req, res, next) => {
    const { id } = req.params;

    knex('rest').where('id', id).update(req.body).then((dados) => {
        if (!dados) return res.send(new errs.BadRequestError('Nenhum registro encontrado'));
        res.send(dados);
    }, next)
});

server.del('/delete/:id', (req, res, next) => {
    const { id } = req.params;

    knex('rest').where('id', id).delete().then((dados) => {
        if (!dados) return res.send(new errs.BadRequestError('Nenhum registro encontrado'));
        res.send("Excluido com sucesso");
    }, next)
});