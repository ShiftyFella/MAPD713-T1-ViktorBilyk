//MAPD713 - Test 1
//Student # 300964200
//Viktor Bilyk

//intial params
var SERVER_NAME = 'Product Engine BackEnd';
var PORT = 3002;
var HOST = '127.0.0.1';


//required dependencies
var restify = require('restify');
var gamesInMemDB = require('save')('games');

//creating server
server = restify.createServer({ name: SERVER_NAME});

//starting server at desired Host:Port
server.listen(PORT, HOST, function () {
    console.log("Server %s started listening at %s", server.name, server.url);
    console.log("Avaliable endpoints:");
    console.log("%s/games  GET --- Shows all games", server.url);
    console.log("%s/games POST --- Add game in format {id,title: name, platform: platform_name}", server.url);
});

//ability to use POST and mapping request parametrs
server.use(restify.fullResponse());
server.use(restify.bodyParser());

//GET endpoint that displays All information
server.get('/games', function (req, res, next) {
    console.log("---> Get: request received");
    gamesInMemDB.find({}, function (error, games) {
        console.log("---< Get: sending response");
        res.send(games);
    });
});

//POST endpoint that adds to memory database received product
server.post('/games', function (req, res, next) {

    postRequestCounter++;
    console.log("---> Post: request received");

    //if one or more parametrs are not supplied show error
    if (req.params.title === undefined ) {
        console.log("--< Post: Error - No Game Title");
        return next(new restify.InvalidArgumentError('Game title must be entered'));
    }

    if (req.params.platform === undefined) {
        console.log("--< Post: Error - No platform specified");
        return next(new restify.InvalidArgumentError('Game platform should be supplied'));
    }

    //creating product object
    var newGame = {
        title: req.params.title,
        platform: req.params.platform
    };

    //saving product in memory, if error, display error, otherwise send product info in body response
    gamesInMemDB.create(newGame, function (error, game) {
        if (error) {
            console.log("---< Post: Error creating a game");
            return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
        }
        else {
            res.send(201,game);
            console.log("---< Post: sending game response");
        }
    });
});


