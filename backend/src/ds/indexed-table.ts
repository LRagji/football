import { ICellValue } from "../interfaces/i-cell-value";

export class IndexedTable {

    private rowCounter = 0;
    private readonly table = new Map<number, ICellValue[]>();
    private readonly indexes = new Map<number, Map<string, Set<number>>>();

    constructor(private readonly columnsToIndex: number[]) { }

    public upsert(row: ICellValue[], rowId?: number) {
        if (rowId === undefined) {
            rowId = this.rowCounter++;
        }
        this.table.set(rowId, row);

        for (const indexCol of this.columnsToIndex) {
            if (row[indexCol] != undefined) {
                const indexMap = this.indexes.get(indexCol) || new Map<string, Set<number>>();
                const rowMap = indexMap.get(row[indexCol].IndexKey) || new Set<number>();
                rowMap.add(rowId);
                indexMap.set(row[indexCol].IndexKey, rowMap);
                this.indexes.set(indexCol, indexMap);
            }
        }
    }

    public get(rowId: number): ICellValue[] | undefined {
        return this.table.get(rowId);
    }

    public getByIndex(indexCol: number, indexKey: string): Set<number> | undefined {
        return this.indexes.get(indexCol)?.get(indexKey);
    }

    public getAll(): Map<number, ICellValue[]> {
        return this.table;
    }
}