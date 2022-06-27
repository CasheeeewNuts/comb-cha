import {Either, isRight, left, right} from "fp-ts/Either";

export abstract class Stream<T> {
    public abstract endOf(index: number): boolean
    protected abstract unsafeGet(index: number): T

    public constructor(
        protected source: T
    ) {}

    location(index: number) {
        return index
    }

    public get(index: number): Either<string, T> {
        try {
            if (this.endOf(index)) {
                return left("End of stream reached")
            } else {
                return right(this.unsafeGet(index))
            }
        } catch (e) {
            if (typeof e === "string") {
                return left(e)
            }

            if (e instanceof Error) {
                return left(e.message)
            }

            throw e
        }
    }

    public subStreamAt(s: any[], index: number): boolean {
        return s.every((a, i) => {
            const v = this.get(i + index)

            return isRight(v) && v.right === s[i]
        })
    }
}