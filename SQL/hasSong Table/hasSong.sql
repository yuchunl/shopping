CREATE TABLE hasSong (
upc int,
title varchar(60),
PRIMARY KEY(upc, title),
FOREIGN KEY(upc) 
	REFERENCES item(upc)
	on DELETE CASCADE
	on UPDATE CASCADE
);
