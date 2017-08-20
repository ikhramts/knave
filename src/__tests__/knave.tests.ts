import { Knave } from '../knave';
import { Table } from '../model';

describe("Knave", () =>{
    it("should pass", () => {
        expect(true).toBe(true);
    });

    it("Should parse", () => {
        expect.assertions(2);
        return Knave.buildFile(inputFile('test1.sql')).then(table => {
            expect(table).not.toBeNull();
            expect(table.name).toBe("MyTable");
        })
    })
});

function inputFile(pathFromTests:string) : string {
    return "src/__tests__/inputs/" + pathFromTests;
}