CREATE TABLE orderReturn (retId int, returnDate date, receiptId int, 
	PRIMARY KEY (retId),
	FOREIGN KEY (receiptId) REFERENCES purchase (receiptId) ON DELETE CASCADE ON UPDATE CASCADE);