const mysql = require("mysql");
const fs = require("fs");
const { connection } = require("../connection");
const path = require("path");
var zipdir = require("zip-dir");
const converter = require("json-2-csv");
var json2xls = require("json2xls");
const { sep } = require("path");

exports.database = async (req, res, next) => {
    connection.connect(function (err) {
        connection.query("show databases", function (err, result, fields) {
            if (err) throw err;
            const results = result.map((r) => r["Database"]);
            if (results) {
                res.status(200).json({
                    "Total-Databases": result.length,
                    result,
                    message: "Databases Found!",
                });
                //console.log(results);
            }
        });
    });
};

exports.table = async (req, res, next) => {
    try {
        connection.connect(function (err) {
            let query =
                "select table_schema, table_name from information_schema.tables WHERE table_schema NOT IN ( 'information_schema', 'performance_schema', 'mysql','phpmyadmin' )";
            connection.query(query, function (err, tables, fields) {
                if (err) throw err;
                const result = tables.map((table) => table["table_name"]);
                if (result) {
                    res.status(200).json({
                        "Total-Tables": result.length,
                        result,
                        message: "Tables Found!",
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};


exports.view = async (req, res, next) => {
    try {
        connection.connect(function (err) {
            let query =
                "select view_schema, view_name from information_schema.views WHERE view_schema NOT IN ( 'information_schema', 'performance_schema', 'mysql','phpmyadmin' )";
            connection.query(query, function (err, tables, fields) {
                if (err) throw err;
                const result = views.map((view) => view["view_name"]);
                if (result) {
                    res.status(200).json({
                        "Total-Views": result.length,
                        result,
                        message: "Views Found!",
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};
exports.tableByDb = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;

        connection.connect(function (err) {
            let query1 = "SHOW TABLES FROM " + dbname;

            connection.query(query1, function (err, tables, fields) {
                if (err) throw err;
                //console.log(table)
                const result = tables.map((table) => table["Tables_in_" + dbname]);

                if (result) {
                    res.status(200).json({ result, message: "Tables Found!" });
                    //console.log(result);
                }
            });
        });
        //})
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};

exports.viewByDb = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;

        connection.connect(function (err) {
            let query2 =
                "SHOW FULL TABLES IN " + dbname + " WHERE TABLE_TYPE LIKE 'VIEW';";

            connection.query(query2, function (err, tables, fields) {
                if (err) throw err;
                //console.log(table)
                const result = tables.map((table) => table["Tables_in_" + dbname]);

                if (result) {
                    res.status(200).json({ result, message: "Tables Found!" });
                    //console.log(result);
                }
            });
        });
        //})
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};

exports.downloadMultiple = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;
        let tablename = req.body.tablename;
        let newDirectory = req.body.newDirectory;
        let fileType = req.body.fileType;
        let qualifier = req.body.qualifier;
        console.log("-----------download-----------", tablename);
        if (tablename.length > 1) {
            tablename = tablename.split(",");
        }
        let separator = req.body.separator;

        connection.connect(function (err) {
            let query1 = "USE " + dbname;

            let filePaths = [];
            connection.query(query1, function (err, result, fields) {
                if (err) throw err;
                for (i = 0; i < tablename.length; i++) {
                    if (tablename.length >= 1) {
                        let count = tablename.length;

                        let query = "SELECT * FROM " + tablename[i];
                        let tempTableName = tablename[i];

                        if (result) {
                            connection.query(query, function (err, table, fields) {
                                if (err) throw err;

                                let data = JSON.stringify(table);
                                const jsonData = JSON.parse(data);

                                let file;
                                let options;

                                if (fileType == "csv") {
                                    file = newDirectory + `/${tempTableName}.csv`;
                                    separator=",";
                                    options = {
                                        delimiter: {
                                            field: ",",
                                        },
                                    };
                                }

                                if (fileType == "tsv") {
                                    file = newDirectory + `/${tempTableName}.tsv`;
                                    separator="\t";
                                    options = {
                                        delimiter: {
                                            field: "\t",
                                        },
                                    };
                                }

                                if (fileType == "txt") {
                                    file = newDirectory + `/${tempTableName}.txt`;
                                    options = {
                                        delimiter: {
                                            field: separator,
                                        },
                                    };
                                }
                                if (fileType == "json") {
                                    file = newDirectory + `/${tempTableName}.json`;

                                    let data1 = JSON.stringify(jsonData, null, " ");
                                    fs.writeFile(file, data1, "utf8", function (err) {
                                        if (err) throw err;
                                        console.log("complete");
                                        filePaths.push(file);
                                        console.log(filePaths);
                                        if (count == filePaths.length) {
                                            console.log("Json File Downloaded!");
                                        }
                                    });
                                    return;
                                }
                                if (fileType == "xls") {
                                    file = newDirectory + `/${tempTableName}.xlsx`;
                                    var xls = json2xls(jsonData);
                                    fs.writeFile(file, xls, "binary", function (err) {
                                        if (err) throw err;
                                        console.log("complete");
                                        filePaths.push(file);
                                        console.log(filePaths);
                                        if (count == filePaths.length) {
                                            console.log("Excel File Downloaded!");
                                        }
                                    });
                                    return;
                                }

                                let json2csvCallback = function (err, csv) {
                                    if (err) throw err;
                                    if (qualifier) {
                                        csv = csv
                                            .split(separator)
                                            .map((key) => qualifier + key + qualifier)
                                            .join(separator);
                                            let n = csv.split("\n").length;
                                            csv = csv
                                            .split("\n")
                                            .map((key, index) => {
                                                if(index===0){
                                                    return key+qualifier;
                                                }else if(index === n-1){
                                                    return qualifier+key;
                                                }
                                                else{
                                                   return qualifier + key + qualifier
                                                }
                                               
                                            })
                                            .join("\n");
            
                                    }
                                    fs.writeFile(file, csv, "utf8", function (err) {
                                        if (err) throw err;
                                        console.log("complete" + count);
                                        filePaths.push(file);
                                        console.log(filePaths);
                                        if (count == filePaths.length) {
                                            console.log("Files Downloaded!");
                                        }
                                    });
                                };
                                converter.json2csv(table, json2csvCallback, options);
                                console.log("----------");
                                console.log(filePaths);
                            });
                        }
                    }
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};




exports.downloadSingle = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;
        let tablename = req.body.tablename;
        let separator = req.body.separator;
        let newDirectory = req.body.newDirectory;
        let fileType = req.body.fileType;
        let qualifier = req.body.qualifier;
        connection.connect(function (err) {
            let query1 = "USE " + dbname;

            connection.query(query1, function (err, result, fields) {
                if (err) throw err;

                let query = "SELECT * FROM " + tablename;

                if (result) {
                    connection.query(query, function (err, table, fields) {
                        if (err) throw err;
                        let data = JSON.stringify(table);
                        const jsonData = JSON.parse(data);

                        let file;
                        let options;

                        if (fileType == "csv") {
                            file = newDirectory + `/${tablename}.csv`;
                            separator=","
                            options = {
                                delimiter: {
                                    field: ",",
                                },
                            };
                            
                        }

                        if (fileType == "tsv") {
                            file = newDirectory + `/${tablename}.tsv`;
                            separator="\t"
                            options = {
                                delimiter: {
                                    field: "\t",
                                },
                            };
                        }

                        if (fileType == "txt") {
                            file = newDirectory + `/${tablename}.txt`;
                            options = {
                                delimiter: {
                                    field: separator,
                                },
                            };
                        }

                        if (fileType == "json") {
                            file = newDirectory + `/${tablename}.json`;

                            let data1 = JSON.stringify(jsonData, null, " ");
                            fs.writeFile(file, data1, "utf8", function (err) {
                                if (err) throw err;
                                console.log("complete");
                                console.log("Json File Downloaded!");
                            });
                            return;
                        }

                        if (fileType == "xls") {
                            file = newDirectory + `/${tablename}.xlsx`;
                            var xls = json2xls(jsonData);
                            fs.writeFile(file, xls, "binary", function (err) {
                                if (err) throw err;
                                console.log("complete");
                                console.log("Excel File Downloaded!");
                            });
                            return;
                        }

                        let json2csvCallback = function (err, csv, fields) {
                            if (err) {
                                console.log("-------single_file_error_1-------", err);
                                throw err;
                            }
                            if (qualifier) {
                                csv = csv
                                    .split(separator)
                                    .map((key) => qualifier + key + qualifier)
                                    .join(separator);
                                let n = csv.split("\n").length;
                                csv = csv
                                    .split("\n")
                                    .map((key, index) => {
                                        console.log("Key: ", key, index);
                                        if(index===0){
                                            return key+qualifier;
                                        }
                                        else if(index === n-1){
                                            return qualifier+key;
                                        }
                                        else{
                                           return qualifier + key + qualifier
                                        }
                                       
                                    })
                                    .join("\n");

                                
                                
                            }

                            fs.writeFile(file, csv, "utf8", function (err) {
                                if (err) {
                                    console.log("-------single_file_error_1-------", err);
                                    throw err;
                                }
                                console.log("complete");

                                console.log("File Downloaded!");
                            });
                        };

                        converter.json2csv(table, json2csvCallback, options);
                    });
                }
            });
        });
        res.status(201).json("File Loaded");
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};
