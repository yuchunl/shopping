CREATE TABLE leadSinger (
upc int,
name varchar(60),
PRIMARY KEY(upc, name),
FOREIGN KEY(upc) 
	REFERENCES item(upc)
	on DELETE CASCADE
	on UPDATE CASCADE
);
