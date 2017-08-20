
Start
    = _ table:Table _ { return table; }

Table
    = CREATE _ TABLE _ tableName:Identifier { return new Table({name: tableName}); }

// ----------- General -----------------
_
    = Whitespace*

Whitespace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"


// ----------- Keywords ----------------
Keyword
    = CREATE
    / TABLE

CREATE = "CREATE"i !IdentifierBodyChar
TABLE = "TABLE"i !IdentifierBodyChar

// ----------- Identifiers ------------
Identifier
    = !Keyword id:IdentifierName { return id; }

IdentifierName
    = firstChar:IdentifierFirstChar body:IdentifierBodyChar* { return firstChar + body.join('');}

IdentifierFirstChar = [a-zA-Z_]

IdentifierBodyChar = [a-zA-Z0-9_]




