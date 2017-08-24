import * as mssql from 'mssql';

import { KnaveModel } from '../model';
import { DbConfig } from '../config';
import { DbAdapter } from './dbAdapter';
import { MssqlColumnDef, buildModel } from './mssqlModelBuilder';

export class MssqlAdapter implements DbAdapter {
    dbConfig: DbConfig;

    constructor(dbConfig: DbConfig) {
        this.dbConfig = dbConfig;
    }

    queryModel(config: DbConfig) : Promise<KnaveModel> {
        let connectionConfig = <mssql.config>{
            server: config.host,
            database: config.database,
            user: config.username,
            password: config.password,
            options: { encrypt: true }
        };

        if (config.port) connectionConfig.port = config.port;
        let query = queryTemplate.replace('{dbName}', config.database);

        let promise = new Promise<KnaveModel>((resolve, reject) => {
            let pool = new mssql.ConnectionPool(connectionConfig, err => {
                if (err) reject(err);

                pool.request().query(query)
                    .then(result => {
                        let dbColumns = result.recordset.map(c => new MssqlColumnDef(c));
                        let model = buildModel(dbColumns);

                        resolve(model);
                    },
                    err => {
                        console.log(err);
                        pool.close();
                        reject(err);
                    }
                );
            });

        });

        return promise;
    }
    renderDiff: () => string;
    execute: (sql: String) => void;

}

const queryTemplate = `
with cte_tablesInDb as (select
	object_id(TABLE_NAME) as tableId,
	TABLE_NAME as tableName
from INFORMATION_SCHEMA.TABLES 
where 
	TABLE_TYPE='BASE TABLE'
	and TABLE_CATALOG='{dbName}'
)
select 
	tb.tableName as tableName,
    c.name as columnName,
    t.Name as columnType,
    c.max_length as maxLength,
    c.precision,
    c.scale ,
    c.is_nullable as isNullable,
    ISNULL(i.is_primary_key, 0) as isPrimaryKey
FROM    
    sys.columns c
inner join 
    sys.types t ON c.user_type_id = t.user_type_id
left outer join 
    sys.index_columns ic ON ic.object_id = c.object_id AND ic.column_id = c.column_id
left outer join 
    sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
inner join 
	cte_tablesInDb tb on tb.tableId = c.object_id
order by tb.tableName
`;