DROP TABLE IF EXISTS Address;
CREATE TABLE IF NOT EXISTS Address(address TEXT, addressid BIGINT,  PRIMARY KEY (addressid));

DROP TABLE IF EXISTS Employee;
CREATE TABLE IF NOT EXISTS Employee(empId BIGINT, ispermanant BOOLEAN, address BLOB, salary DOUBLE, name TEXT, departments BLOB, joiningdate FROZEN<TUPLE<TIMESTAMP, TEXT>>, age INT, phone BLOB,  PRIMARY KEY (empId));

DROP TABLE IF EXISTS Phone;
CREATE TABLE IF NOT EXISTS Phone(mobile TEXT, phoneid BIGINT, home TEXT,  PRIMARY KEY (phoneid));

DROP TABLE IF EXISTS Book;
CREATE TABLE IF NOT EXISTS Book(bid INT, author TEXT, title TEXT,  PRIMARY KEY (bid));


