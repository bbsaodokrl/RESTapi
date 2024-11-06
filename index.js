const restify = require("restify");
const errors = require("restify-errors");

const server = restify.createServer({
    name: "lojinha",
    version: "1.0.0"
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8001, function () {
    console.log("%s executando em: %s", server.name, server.url);
});

var knex = require("knex")({
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: "",
        database: "bd_dsapi"
    }
});

server.get("/", (req, res, next) => {
    res.send("Seja bem-vindo a nossa loja");
});


server.get("/produtos", (req, res, next) => {
    knex("produtos")
        .then((dados) => {
            res.send(dados);
        }, next);
});

server.get("/produtos/:idProd", (req, res, next) => {
    const id = req.params.idProd;
    knex("produtos")
        .where("id", id)
        .first()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError("Nenhum produto encontrado"));
            }
            res.send(dados);
        }, next);
});

server.post("/produtos", (req, res, next) => {
    knex("produtos")
        .insert(req.body)
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError("Não foi possível inserir"));
            }
            res.send(dados);
        }, next);
});

server.put("/produtos/:idProd", (req, res, next) => {
    const id = req.params.idProd;
    knex("produtos")
        .where("id", id)
        .update(req.body)
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError("Não foi possível editar"));
            }
            res.send("Produto editado com sucesso");
        }, next);
});

server.del("/produtos/:idProd", (req, res, next) => {
    const id = req.params.idProd;
    knex("produtos")
        .where("id", id)
        .delete()
        .then((dados) => {
            if (!dados) {
                return res.send(new errors.BadRequestError("Não foi possível excluir"));
            }
            res.send("Produto excluído com sucesso");
        }, next);
});
