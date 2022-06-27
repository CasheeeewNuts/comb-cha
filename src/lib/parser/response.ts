import {Stream} from "../stream/stream";
import {Either, left, right} from "fp-ts/Either";

abstract class ParseResponse<V, I> {
    public abstract readonly value: V

    protected constructor(
        public readonly input: Stream<I>,
        public readonly offset: number,
        public readonly consumed: boolean
    ) {
    }

    public try(): Either<string, V> {
        return this.fold(
            accept => right(accept.value),
            reject => left(`parser error at ${reject.offset}`)
        )
    }

    public isAccepted(): this is Accepted<V, I> {
        return this.fold(
            () => true,
            () => false
        )
    }

    public isEos(): boolean {
        return this.input.endOf(this.offset)
    }

    public location() {
        return this.input.location(this.offset)
    }

    public abstract fold<T>(
        onAccepted: (r: Accepted<V, I>) => T,
        onRejected: (r: Rejected<V, I>) => T
    ): T

    public abstract map<Y>(f: (l: V) => Y): ParseResponse<Y, I> | ParseResponse<V, I>
}

class Accepted<V, I> extends ParseResponse<V, I> {
    public constructor(public override readonly value: V, input: Stream<I>, offset: number, consumed: boolean) {
        super(input, offset, consumed);
    }

    override map<Y>(f: (l: V) => Y): Accepted<Y, I> {
        return new Accepted(f(this.value), this.input, this.offset, this.consumed)
    }

    override fold<T>(onAccepted: (r: Accepted<V, I>) => T, onRejected: (r: Rejected<V, I>) => T): T {
        return onAccepted(this)
    }
}

class Rejected<V, I> extends ParseResponse<V, I> {
    public override readonly value: V = null as never

    public constructor(input: Stream<I>, offset: number, consumed: boolean) {
        super(input, offset, consumed);
    }

    override map(): Rejected<V, I> {
        return new Rejected(this.input, this.offset, this.consumed)
    }

    override fold<T>(_: (r: Accepted<V, I>) => T, onRejected: (r: Rejected<V, I>) => T): T {
        return onRejected(this)
    }
}

export type Response<V, I> = Accepted<V, I> | Rejected<V, I>

export function accept<V, I>(v: V, input: Stream<I>, offset: number, consumed: boolean): Accepted<V, I> {
    return new Accepted(v, input, offset, consumed)
}

export function reject<V, I>(input: Stream<I>, offset: number, consumed: boolean): Rejected<V, I> {
    return new Rejected(input, offset, consumed)
}