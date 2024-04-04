export interface Store<S> {
    get(): S | null
    set(s: S): void
    clear(): void
}
