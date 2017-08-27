export function itAll<T>(description:string, testCases:T[], testBody: (args:T)=>void) {
    let its: (() => void)[] = [];

    for(let testCase of testCases) {
        let itDescription = JSON.stringify(testCase);
        let itCall = () => {
            it(itDescription, () => {testBody(testCase)})
        };

        its.push(itCall);
    };

    describe(description, () => {
        for (let itCall of its) {
            itCall();
        }
    });
};