import {Stream} from "./stream";

class StringStream extends Stream<string> {
    public override endOf(index: number): boolean {
        return this.source.length <= index;
    }

    protected override unsafeGet(index: number): string {
        return this.source.charAt(index);
    }

}

export function factory(source: StringStream["source"]) {
    return new StringStream(source)
}