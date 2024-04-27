import { IndexedTable } from "../src/ds/indexed-table";
import { ICellValue } from "../src//interfaces/i-cell-value";
import { beforeEach, describe, it } from "node:test";
import assert from "node:assert";

describe("IndexedTable", () => {
    let indexedTable: IndexedTable;

    beforeEach(() => {
        indexedTable = new IndexedTable([0, 1]);
    });

    it("should insert a row and retrieve it by rowId", () => {
        const row: ICellValue[] = [{ IndexKey: "key1", Data: "D1" }, { IndexKey: "key2", Data: "D2" }];
        indexedTable.upsert(row, 1);

        const result = indexedTable.get(1);

        assert.strictEqual(result, row);
    });

    it("should insert a row and retrieve it by index", () => {
        const row1: ICellValue[] = [{ IndexKey: "key1", Data: "D1" }, { IndexKey: "key2", Data: "D2" }];
        const row2: ICellValue[] = [{ IndexKey: "key3", Data: "D3" }, { IndexKey: "key4", Data: "D4" }];
        indexedTable.upsert(row1, 1);
        indexedTable.upsert(row2, 2);

        const result = indexedTable.getByIndex(0, "key3");

        assert.strictEqual(result?.size, 1);
        assert.strictEqual(result?.has(2), true);
    });

    it("should return all rows", () => {
        const row1: ICellValue[] = [{ IndexKey: "key1", Data: "D1" }, { IndexKey: "key2", Data: "D2" }];
        const row2: ICellValue[] = [{ IndexKey: "key3", Data: "D3" }, { IndexKey: "key4", Data: "D4" }];
        indexedTable.upsert(row1, 1);
        indexedTable.upsert(row2, 2);

        const result = indexedTable.getAll();

        assert.strictEqual(result.size, 2);
        assert.strictEqual(result.get(1), row1);
        assert.strictEqual(result.get(2), row2);
    });
});