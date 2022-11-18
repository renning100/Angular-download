const mysql = require("mysql");
const fs = require("fs");
const ws = fs.createWriteStream("mydb.csv");

exports.connectionU = async (req, res, next) => {
    const host = req.body.host;
    const user = req.body.user;
    const password = req.body.password;


    console.log(host)
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
    });



    // writeFile function with filename, content and callback function
    fs.writeFile('connection.js', `const mysql = require("mysql");

    const connection = mysql.createConnection({
        host: "${host}",
        user: "${user}",
        password: "${password}",
        });
                                        
    module.exports= { connection: connection }`, function (err) {
        if (err) throw err;
        ws.on('finish', 
            res.status(200)
                .json({

                    message: "Server setup!",
                })

        );
        console.log('File is created successfully.');
    })
};