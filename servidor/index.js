// importando bibliotecas
const restify = require('restify');
const errs = require('restify-errors');


const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

/*  criando uma conexao com o banco usando a biblioteca knex
    knex é um construtor de consultas sql para diversos bancos
*/
const knex = require('knex')({
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'root',
      password : '',
      database : 'bd_pratica1'
    }
  });

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});


server.get('/',restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'
}));

/*  
    Fazendo uma consulta a tabela REST
    e guardando o JSON ressposta vindo no paramentro RES
    dentro de uma variavel DADOS
*/
server.get('/read', function (req, res, next) {
     
    knex('rest').then((dados)=>{
       res.send(dados); 
    }, next);    
    
    return next();
  });

/*  
    Executando uma requisicao REQ
    enviando os parameetros vindo do BODY
    e passados pelo REQ enviando por um
    INSERT do knex
*/
server.post('/create', function(req, res, next){
    knex('rest')
        .insert(req.body)
        .then((dados)=>{
        res.send(dados); 
     }, next);

});

/*
    Consulta por parametro
    :id informa que esta se passando uma variavel como paramentro
    
*/
server.get('/show/:id', function (req, res, next) {
    // criamos a variavel que recebe os parametros trazido pela requisicao REQ
    const {id} = req.params;
    knex('rest')
        .where('id', id)
        // retorne o primeiro que achar
        .first()
        .then((dados)=>{
            // caso retorne zero ou um erro | lembrar de importar a biblioteca de erros 
            if(!dados) return res.send(new errs.BadRequestError('nada encontrado'))
            res.send(dados); 
    }, next);    
        
  });

/*
  fazendo atualizacoes de dados
*/
server.put('/update/:id', function (req, res, next) {
    // criamos a variavel que recebe os parametros trazido pela requisicao REQ
    const {id} = req.params;
    knex('rest')
        .where('id', id)
        // atualiza dados vindo na requisicao REQ e do body
        .update(req.body)
        .then((dados)=>{
            // caso retorne zero ou um erro | lembrar de importar a biblioteca de erros 
            if(!dados) return res.send(new errs.BadRequestError('nada encontrado'))
            //como retornar uma consição de true exiba a mensagem
            res.send('dados atualizados'); 
    }, next);    
        
  });

/*
  Deletando dados
*/
/*
  fazendo atualizacoes de dados
*/
server.del('/delete/:id', function (req, res, next) {
    // criamos a variavel que recebe os parametros trazido pela requisicao REQ
    const {id} = req.params;
    knex('rest')
        .where('id', id)
        // excluir dados pelo ID
        .delete()
        .then((dados)=>{
           
            // caso retorne zero ou um erro | lembrar de importar a biblioteca de erros 
            if(!dados) return res.send(new errs.BadRequestError('nada encontrado'))
            
            //como retornar uma consição de true exiba a mensagem
            res.send('dados excluido'); 
    }, next);    
        
  });
