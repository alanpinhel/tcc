var express = require("express")                // Framework para MVR, MVC, roteamento, file uploads, etc.
  , load = require("express-load")              // Mapeia diretórios para carregar e injetar módulos
  , bodyParser = require("body-parser")         // Transforma dados de formulário em objeto JSON
  , cookieParser = require("cookie-parser")     // Gerenciador de cookies
  , expressSession = require("express-session") // Controle de sessão
  , methodOverride = require("method-override") // Padrão de rotas REST
  , error = require("./middlewares/error")      // Controle de erros
  , compression = require("compression")        // Otimiza express
  , app = express()                             // Objeto correspondente a toda aplicação
  , server = require("http").Server(app)        // 
  , io = require("socket.io")(server)           // 
  , cfg = require("./config.json")              // Arquivo de configuração geral
  , cookie = cookieParser(cfg.SECRET)           // Cookie com SessionID para comunicação com controle de sessão
  , helmet = require ("helmet")                 // Trata tipos de ataque no protocolo HTTP
  , csurf = require("csurf")                    // Previne ataque XSS
  , multer = require("multer")                  // Manipula formulários multipart/form-data
  , storage                                     // Define customização no armazenamento de arquivo
  , InfiniteLoop = require('infinite-loop')     // Loop infinito
;

// Define diretório de views e template engine para renderização
app.set("views", __dirname + "/views/assets");
app.set("view engine", "ejs");

// Aplica SessionID em cookie
app.use(cookie);

// Define controle de sessão
app.use(expressSession({
  secret: cfg.SECRET,
  name: cfg.KEY,
  resave: true,
  saveUninitialized: true
}));

// Cria objetos JSON a partir de formulários HTML
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Permite que uma mesma rota seja reaproveitada entre métodos distindos do HTTP
app.use(methodOverride("_method"));

// Habilita compactação Gzip
app.use(compression());

// Define diretório de arquivos estáticos (.css, .js, .jpg e etc.) e adiciona cache
app.use(express.static(__dirname + "/public", {
  maxAge: 3600000 // milisegundos
}));

// Ativa proteção contra ataques sobre o protocolo HTTP
app.use(helmet());

// Salva fotos no destino "public/upload" no formato nome_data.extensão
storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    var ext = file.originalname.substr(file.originalname.lastIndexOf('.'));
    cb(null, Date.now() + ext);
  }
});
app.use(multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Somente arquivos de imagem são permitidos."));
    }
    cb(null, true);
  }
}).array("photo"));

// Aplica token de proteção contra ataques XSS
app.use(csurf());
app.use(function(req, res, next) {
  res.locals._csrf = req.csrfToken();
  next();
});

// Carrega módulos e injeta no objeto da aplicação
load("models")
  .then("controllers")
  .then("routes")
  .into(app);

load("sockets")
  .into(io);

// Trata erro de página não encontrada
app.use(error.notFound);

// Trata erro genérico de status HTTP
app.use(error.serverError);

// Inicia aplicação de acordo com porta definida no sistema operacional
server.listen(process.env.PORT, function() {
  console.log("Let's Go");
  
  var il = new InfiniteLoop()
    , endsRaffle = require("./middlewares/ends-raffle")
    , resetLimitUser = require("./middlewares/reset-limit-user")
  ;
  
  function forever() {
    endsRaffle(app.models.raffle, app.models.gift);
    resetLimitUser(app.models.user);
  }
  
  il
    .add(forever, [])
    .setInterval(86400 * 1000)
    .run();
    
});