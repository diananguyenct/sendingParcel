module.exports = (app, db) => {
    
//Main menu 
    app.get('/menu', function(req, res) {
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/menu.html');
    });

    app.get('/parcelHistory', function(req, res) {
        const parcelId = (req.query.parcelId);

        const sqlParcelHistory = `SELECT l.parcelId, loc.locAddress, cust.custName, 
            
            DATE_FORMAT(l.date, '%d/%m/%Y %H:%i:%s') AS date,
            l.time, l.operation FROM located l
            LEFT JOIN locations loc ON (loc.locId = l.locId)
            LEFT JOIN parcels par ON (par.parcelId = l.parcelId)
            LEFT JOIN customers cust ON (cust.custId = par.custId)
            WHERE l.parcelId = ${parcelId} `;

        const values = [];
        let postProcess =   function (err, result) {
            if (err) throw err;
            res.render('parcelHistory.html', { parcelHistories: result });
        };
        db.query(sqlParcelHistory, values, postProcess);
    });

/*================== Location =================*/
    app.get('/locations', function(req, res) {
        
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/ngLocationsCRUD.html');
    });

    app.get('/ngLocationsCRUD.js', function(req, res) {
        
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/ngLocationsCRUD.js');
    });

    app.get('/getAllLocations', function(req, res) {
        
            let sqlSelectLocation = 'SELECT locId, locAddress, city FROM locations';
            
            // response contains a json array with all tuples
            let postProcessSQL =   function (err, result) {
                if (err) throw err;

                res.json(result);
            };
            db.query(sqlSelectLocation, postProcessSQL);
    });
    
    app.get('/insLocation', function(req, res) {
            let address = (req.query.newAddress);
            let city    = (req.query.newCity);
     
            let sqlInsertLoc = 'INSERT INTO locations(locAddress, city) VALUES(?, ?)';
            let values = [address, city];
    
            // create a json object containing the inserted location
            let postProcessInsert =   function (err, result) {
                if (err) throw err;  
                res.json({id: result.insertId, address: address, city: city, insertedLines: result.affectedRows });
            };
            db.query(sqlInsertLoc, values, postProcessInsert);
       
    });
    
    app.get('/updLocation', function(req, res) {
        
            let id = (req.query.updId);
            let address = (req.query.updAddress);
            let city    = (req.query.updCity);
     
            let sqlUpdatLoc = 'UPDATE locations SET locAddress = ?, city = ? WHERE locId = ?';
            let values = [address, city, id];
    
            // create a json object containing the inserted location
            let postProcessUpdate =   function (err, result) {
                if (err) throw err;
                
                console.log({id: result.insertId, address: address, city: city, 
                                  insertedLines: result.affectedRows });
                res.json({id: id, address: address, city: city, 
                                  updatedRows: result.changedRows });
            };
      
            db.query(sqlUpdatLoc, values, postProcessUpdate);
    
    });
    
    app.get('/delLocation', function(req, res) {
            let id = (req.query.delId);
     
            let sqlDeleteLoc = 'DELETE FROM locations WHERE locId = ?';
            let values = [id];
    
            // create a json object containing the number of deleted locations
            let postProcessDelete =   function (err, result) {
                if (err) throw err;
    
                res.json({deletedLines: result.affectedRows });
            };
      
            db.query(sqlDeleteLoc, values, postProcessDelete);
         
    });

/*================== Customer =================*/
    app.get('/customers', function(req, res) {
            
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/ngCustomers.html');
    });


    app.get('/ngCustomers.js', function(req, res) {
        
        // send the angular app
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile( __dirname + '/js' + '/ngCustomers.js');
    });

    app.get('/getAllCustomers', function(req, res) {

            let sqlSelectCust = 'SELECT cust.custId, cust.custName, cust.custLocation, loc.locAddress ' +
                    ' FROM customers cust LEFT JOIN locations loc ON (cust.custLocation = loc.locId)';
            
            // response contains a json array with all tuples
            let postProcessSQL =   function (err, result) {
                if (err) throw err;

                res.json(result);
            };
            db.query(sqlSelectCust, postProcessSQL);
    });

    app.get('/insCustomer', function(req, res) {
            let custName = (req.query.newCustName);
            let custLocation    = (req.query.newCustLocation);
    
            let sqlInsertCust = 'INSERT INTO customers(custName, custLocation) VALUES(?, ?)';
            let values = [custName, custLocation];

            // create a json object containing the inserted customer
            let postProcessInsert =   function (err, result) {
                if (err) throw err;  
                res.json({id: result.insertId, custName: custName, custLocation: custLocation, insertedLines: result.affectedRows });
            };
            db.query(sqlInsertCust, values, postProcessInsert);
    
    });

    app.get('/updCustomer', function(req, res) {
            let id = (req.query.updId);
            let custName = (req.query.updCustNames);
            let custLocation = (req.query.updCustLocation);
    
            let sqlUpdateCust = 'UPDATE customers SET custName = ?, custLocation = ? WHERE custId = ?';
            let values = [custName, custLocation, id];

            // create a json object containing the inserted customer
            let postProcessUpdate =   function (err, result) {
                if (err) throw err;
                
                console.log({id: result.insertId, custName: custName, custLocation: custLocation, 
                                insertedLines: result.affectedRows });
                res.json({id: id, custName: custName, custLocation: custLocation, 
                                updatedRows: result.changedRows });
            };
    
            db.query(sqlUpdateCust, values, postProcessUpdate);
    });

    app.get('/delCustomer', function(req, res) {
            let id = (req.query.delId);
    
            let sqlDelCust = 'DELETE FROM customers WHERE custId = ?';
            let values = [id];

            // create a json object containing the number of deleted customers
            let postProcessDelete =   function (err, result) {
                if (err) throw err;
                res.json({deletedLines: result.affectedRows });
            };
    
            db.query(sqlDelCust, values, postProcessDelete);    
    });

/*================== Parcels =================*/
    app.get('/parcels', function(req, res) {
                
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/ngParcels.html');
    });


app.get('/ngParcels.js', function(req, res) {
    
    // send the angular app
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile( __dirname + '/js' + '/ngParcels.js');
});

app.get('/getAllParcels', function(req, res) {
        
        let sqlSelectParcel = 'SELECT par.parcelId, par.weight, cust.custName, loc.locAddress AS finalLocation ' +
                ' FROM parcels par LEFT JOIN customers cust ON (par.custId = cust.custId)' +
                ' LEFT JOIN locations loc ON (par.finalLocation = loc.locId)';
        
        // response contains a json array with all tuples
        let postProcessSQL =   function (err, result) {
            if (err) throw err;

            res.json(result);
        };
        db.query(sqlSelectParcel, postProcessSQL);
});

//Insert new parcel, while insert into located table as well
app.get('/insParcel', function(req, res) {
        let weight = (req.query.newWeight);
        let custId = (req.query.newCustId);
        let finalLocation = (req.query.newLocId);
        let custLocation = (req.query.custLocation);
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        const formattedTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

        let sqlInsertParcel = 'INSERT INTO parcels(weight, custId, finalLocation) VALUES(?, ?, ?)';

        let values = [weight, custId, finalLocation];
        // create a json object containing the inserted customer
        let postProcessInsert = function (err, result) {
            if (err) throw err;  
            let sqlInsertLocated = 'INSERT INTO located(parcelId, locId, date, time, operation) VALUES(?, ?, ?, ?, ?)';
            let locatedValues = [result.insertId, custLocation, formattedDate, formattedTime, 'Boarding'];
            let postInsertLocated = function(err, r){
                if (err) throw err;  
            }
            db.query(sqlInsertLocated, locatedValues, postInsertLocated);

            res.json({id: result.insertId, weight: weight, custId: custId, finalLocation: finalLocation, insertedLines: result.affectedRows });
        };
        db.query(sqlInsertParcel, values, postProcessInsert);
});

app.get('/updParcel', function(req, res) {
        let id = (req.query.updParcelId);
        let weight = (req.query.updWeight);
        let custId = (req.query.updCustId);
        let finalLocation = (req.query.updFinalLocation);

        let sqlUpdateParcel = 'UPDATE parcels SET custName = ?, custId = ?, finalLocation = ? WHERE parcelId = ?';
        let values = [weight, custLocation, finalLocation, id];

        // create a json object containing the inserted customer
        let postProcessUpdate =   function (err, result) {
            if (err) throw err;
            
            res.json({id: id, weight: weight, custId: custId, finalLocation:finalLocation,
                            updatedRows: result.changedRows });
        };

        db.query(sqlUpdateParcel, values, postProcessUpdate);
});

app.get('/delParcel', function(req, res) {
        let id = (req.query.delId);

        let sqlDelParcel = 'DELETE FROM parcels WHERE parcelId = ?';
        let values = [id];

        // create a json object containing the number of deleted customers
        let postProcessDelete =   function (err, result) {
            if (err) throw err;
            res.json({deletedLines: result.affectedRows });
        };

        db.query(sqlDelParcel, values, postProcessDelete);    
    });

/*================== Customer's Parcel =================*/
    //define html page
    app.get('customerParcel', function(req, res) {
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/ngCustomerParcels.html');
    })

    //list all parcels of a customer
    //choose the latested status of each parcel
    app.get('/customerParcels', function(req, res) {
        let custId = (req.query.custId);
        
        let sqlSelectParcel = `SELECT temp.*
        FROM 
        (SELECT par.parcelId, par.weight, cust.custName, loc.locAddress AS finalLocation, 
                        located.operation, located.date, located.time,
                        ROW_NUMBER() OVER (PARTITION BY par.parcelId ORDER BY located.date DESC, located.time DESC) AS rn
                        FROM parcels par LEFT JOIN customers cust ON (par.custId = cust.custId)
                        LEFT JOIN locations loc ON (par.finalLocation = loc.locId)
                        LEFT JOIN located located ON (par.parcelId = located.parcelId)
                        WHERE par.custId = ${custId}
        )AS temp
        WHERE temp.rn=1`;
        
        // response contains a json array with all tuples
        let postProcessSQL =   function (err, result) {
            if (err) throw err;

            res.json(result);
        };
        db.query(sqlSelectParcel, postProcessSQL);
    });

    //View history of a parcel
    app.get('/viewHistoryParcel', function(req, res) {

        let parcelId = (req.query.parcelId);
        let sqlLocated = 'SELECT par.parcelId, par.weight, cust.custName, loc.locAddress AS finalLocation, located.date, located.time, located.operation ' +
        ' FROM parcels par LEFT JOIN customers cust ON (par.custId = cust.custId)' +
        ' LEFT JOIN locations loc ON (par.finalLocation = loc.locId)' +
        ' LEFT JOIN located located ON (par.parcelId = located.parcelId)' +
        ' WHERE par.custId = ' + parcelId;
        
        // response contains a json array with all tuples
        let postProcessSQL =   function (err, result) {
            if (err) throw err;

            res.json(result);
        };
        db.query(sqlLocated, postProcessSQL);
    });

    //Add new status of a parcel
    app.get('/nextParcelStatus', function(req, res) {
        let parcelId = (req.query.parcelId);
        let locId = (req.query.locId);
        let date = (req.query.date);
        let time = (req.query.time);
        let weight = (req.query.weight);
        let operation = (req.query.operation);

        let sqlSelectParcel = `INSERT INTO located (parcelId, locId, date, time, operation)
                            VALUES(${parcelId}, ${locId}, '${date}', '${time}', '${operation}')`;
        
        // response contains a json array with all tuples
        let postProcessSQL =   function (err, result) {
            if (err) throw err;
            res.json({parcelId: parcelId, weight: weight, locId: locId, operation: operation});
        };
        db.query(sqlSelectParcel, postProcessSQL);
    });

    //Rollback a stutus of parcel if it's not delivered
    app.get('/rollbackStatus', function(req, res) {
        let parcelId = (req.query.parcelId);
        let locId = (req.query.locId);
     
        let sqlDeleteLoc = 'DELETE FROM located WHERE parcelId = ? AND locId = ?';
        let values = [parcelId, locId];
    
        // create a json object containing the number of deleted locations
        let postProcessDelete =   function (err, result) {
            if (err) throw err;
    
            res.json({deletedLines: result.affectedRows });
        };
      
        db.query(sqlDeleteLoc, values, postProcessDelete);
    });

    
};