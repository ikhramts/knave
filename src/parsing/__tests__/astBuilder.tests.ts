import { parseFile } from '../astBuilder';
import * as AST from '../../AST';

describe("parseFile()", () => {
    it("Should procude a FileDeclarations object", () => {
        expect.assertions(2);
        return parseFile(inputFile('basicCreateTable.sql')).then(fileDeclarations => {
            expect(fileDeclarations).not.toBeNull();
            expect(fileDeclarations.declarations).not.toBeNull();
        })
    })

    it("Should read table name", () => {
        expect.assertions(1);
        return parseFile(inputFile('basicCreateTable.sql')).then(fileDeclarations => {
            let table = fileDeclarations.declarations[0];
            expect(table.header.name).toBe("Products");;
        })
    })

    it("Should read all table lines", () => {
        expect.assertions(1);
        return parseFile(inputFile('basicCreateTable.sql')).then(fileDeclarations => {
            let table = fileDeclarations.declarations[0];
            expect(table.body.lines.length).toBe(2);
        })
    });

    it("Should read column name", () => {
        expect.assertions(1);
        return parseFile(inputFile('basicCreateTable.sql')).then(fileDeclarations => {
            let column = fileDeclarations.declarations[0].body.lines[0];
            expect(column.name).toBe("id");
        });
    });

    it("Should parse ATS correctly", () => {
        expect.assertions(1);
        return parseFile(inputFile('basicCreateTable.sql')).then(fileDeclarations => {
            expect(fileDeclarations).toMatchSnapshot();
        });
    });
});

function inputFile(pathFromTests:string) : string {
    return "src/parsing/__tests__/inputs/" + pathFromTests;
}