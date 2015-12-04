CREATE TABLE returnItem (retId int, upc int, quantity int, 
	PRIMARY KEY (retId, upc), 
	FOREIGN KEY (retId) REFERENCES orderReturn (retId) ON DELETE CASCADE ON UPDATE CASCADE, 
	FOREIGN KEY (upc) REFERENCES item (upc) ON DELETE NO ACTION ON UPDATE CASCADE);
