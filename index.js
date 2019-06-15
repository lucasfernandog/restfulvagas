const restify = require('restify');

const server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

//Teste!!!
var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: 'u0zbt18wwjva9e0v.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
        user: 'z9cktik1p3l98ftg',
        password: 'y01cmja132fth2b1',
        database: 'khuqwwy3v5bhoqqo'
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
server.get('/positions/:id', (req, res, next) => {
    const { id } = req.params;

    knex('jobs').where('id', id).first().then((dados) => {
        if (!dados) return res.send(new errs.BadRequestError('Nenhum registro encontrado'));
        res.send(dados);
    }, next)
});

server.get('/positions', function (req, res) {
    var { description, full_time, location } = req.query;

    description = (description == null || description == '' ? '%' : '%' + description + "%");
    location = (location == null ? '' : location);
    full_time = (full_time == null || full_time == '' ? '-1' : (full_time == 'true' ? true : false));

    knex('jobs').whereRaw("description like ?" +
        "and case ? when '-1' then true else full_time = ? end" +
        " and case ? when '' then true else location = ? end",
        [description, full_time, full_time, location, location]).then(function (dados) {
            if (!dados) return res.send(new errs.BadRequestError('Nenhum registro encontrado'));

            res.send(dados);
        })
});