import { parseFile } from '../languageAstBuilder';
import * as AST from '../../AST';

describe("parseFile()", () => {
    it("Should parse basic table correctly", () => {
        expect.assertions(1);
        return parseFile(inputFile('basicCreateTable.sql')).then(fileDeclarations => {
            expect(fileDeclarations).toMatchSnapshot();
        });
    });

    it("Should parse file with two tables correctly", () => {
        expect.assertions(1);
        return parseFile(inputFile('twoTables.sql')).then(fileDeclarations => {
            expect(fileDeclarations).toMatchSnapshot();
        });
    });
});

function inputFile(pathFromTests:string) : string {
    return "src/parsing/__tests__/inputs/" + pathFromTests;
}