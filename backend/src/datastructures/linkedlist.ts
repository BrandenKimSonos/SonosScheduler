export interface INode<T> {
    value: T;
    next?: INode<T>;
    previous?: INode<T>;
}

export type TFunction<T, R> = (t: T) => R;

export class Linkedlist<T> {
    private head: INode<T> | undefined = undefined
    private tail: INode<T> | undefined = undefined
    private size: number = 0

    public append = (value: T): Linkedlist<T> => {
        const node = this.forgeNode(value)

        if (this.isEmpty()) {
            this.head = node
            this.tail = node
            this.size++
            return this
        }

        this.appendToTheEndOfTheList(node);
        this.size++

        return this
    }

    public isEmpty = (): boolean => !this.head

    public toArray = (): T[] => {
        const result: T[] = []
        let node = this.head
        while (node) {
            result.push(node.value)
            node = node.next
        }

        return result
    }

    public fromArray = (values: T[]): Linkedlist<T> => {
        values.forEach(v => this.append(v))

        return this
    }

    public removeAtHead = (): Linkedlist<T> => {
        if (this.head) {
            if (this.size === 1) {
                this.tail = undefined
            }
            this.head = this.head.next
            this.size--
        }

        return this
    }

    public find = (compare: TFunction<T, boolean>): INode<T> | undefined=> {
        if (this.isEmpty()) {
            return undefined
        }

        let node = this.head
        while (node) {
            if (compare(node.value)) {
                return node
            }
            node = node.next
        }

        return undefined
    }

    public *items() {
        let node = this.head
        while (node) {
            yield node
            node = node.next
        }
    }

    public getSize(): number {
        return this.size
    }

    public getHead(): INode<T> | undefined {
        if (this.head) {
            return this.head
        }

        return undefined
    }

    public getTail(): INode<T> | undefined {
        if (this.tail) {
            return this.tail
        }

        return undefined
    }

    private appendToTheEndOfTheList = (node: INode<T>) => {
        if (this.tail) {
            this.tail.next = node
            this.tail = node
        }
    }

    private forgeNode = (value: T): INode<T> => {
        return { value, next: undefined, previous: undefined}
    }
}