// Order (receiptId, date, cid, card#, expiryDate, expectedDate, deliveredDate)

CREATE TABLE purchase (
receiptId int, 
orderDate date, 
cid int,
cardNum bigint,
expiryDate date,
expectedDate date,
deliveredDate date,
PRIMARY KEY (receiptId),
FOREIGN KEY (cid) REFERENCES customer (cid) 
	ON DELETE SET NULL 
	ON UPDATE CASCADE);