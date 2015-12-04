CREATE TABLE purchaseItem (
receiptId int,
upc int,
quantity int,
PRIMARY KEY(receiptId, upc), 
FOREIGN KEY (receiptId) REFERENCES purchase (receiptId)
	ON DELETE CASCADE 
	ON UPDATE CASCADE, 
FOREIGN KEY (upc) REFERENCES item (upc)
	ON DELETE NO ACTION 
	ON UPDATE CASCADE);