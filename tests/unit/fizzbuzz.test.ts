import { fizzbuzz } from "../../src/fizzbuzz";

describe("FizzBuzz", () => {
    test("Print number if not multiple of 3 nor of 5", () => {
        expect(fizzbuzz(4)).toEqual("4");
        expect(fizzbuzz(11)).toEqual("11");
    });

    test('Print "Fizz" if multiple of 3', () => {
        expect(fizzbuzz(3)).toEqual("Fizz");
        expect(fizzbuzz(21)).toEqual("Fizz");
    });

    test('Print "Buzz" if multiple of 5', () => {
        expect(fizzbuzz(5)).toEqual("Buzz");
        expect(fizzbuzz(20)).toEqual("Buzz");
    });

    test('Print "FizzBuzz" if multiple of both 3 and 5', () => {
        expect(fizzbuzz(15)).toEqual("FizzBuzz");
    });
});
