import {describe, expect, it} from "vitest";
import {factory} from "./string-stream";

describe("Stream", () => {
    describe("when provided stream 'AAAA'", () => {
        const stream = factory("AAAA")

        it('endOfStream(3) returns true"', () => {
            expect(stream.endOf(4)).toBeTruthy()
        });

        it('endOfStream(0) returns false"', () => {
            expect(stream.endOf(0)).toBeFalsy()
        });
    })
})