CREATE TABLE Locations(  
    locId int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
    locAddress VARCHAR(1000),
    city VARCHAR(100)
) ;

CREATE TABLE Customers(  
    custId int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
    custName VARCHAR(100),
    custLocation int,
    FOREIGN KEY (custLocation) REFERENCES Locations(locId)
) ;

CREATE TABLE Parcels(  
    parcelId int NOT NULL primary key AUTO_INCREMENT comment 'primary key',
    weight FLOAT,
    custId int,
    finalLocation int,
    FOREIGN KEY (custId) REFERENCES Customers(custId),
    FOREIGN KEY (finalLocation) REFERENCES Locations(locId)
) ;

CREATE TABLE Located(  
    parcelId int NOT NULL,
    locId int NOT NULL,
    date DATE,
    time TIME,
    operation VARCHAR(500),
    PRIMARY KEY (parcelId, locId),
    FOREIGN KEY (parcelId) REFERENCES Parcels(parcelId),
    FOREIGN KEY (locId) REFERENCES Locations(locId)
) ;