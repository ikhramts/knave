TABLE Products(
    id bigint NOT NULL primary key,
    lineNumber smallint NOT NULL,
    productName varchar(255),
    price decimal(18,10)
)
