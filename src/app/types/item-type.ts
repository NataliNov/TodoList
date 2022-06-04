export type Item = {
    id?: number,
    name: string,
    checked: boolean
}

export type ItemsData = {
    items: Item[],
    countActive: number,
    count: number
}