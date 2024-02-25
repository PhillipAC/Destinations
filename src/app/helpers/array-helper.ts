import { BaseId } from "../models/base/base-id";

export class ArrayHelper {

    static nextId<T extends BaseId>(array: T[]): number{
        let indexes = array.map(e => e.id);
        let sortedIndexes = indexes.sort();
        let id = sortedIndexes.pop();
    
        console.log(array);
        console.log(indexes);
        console.log(sortedIndexes);
        console.log(id);
    
        let currentId = id ?? -1;
        return currentId + 1;
      }
    
      static selectById<T extends BaseId>(array: T[], id: number): T | undefined{
        return array.find(e => e.id == id);
      }
    
      static removeById<T extends BaseId>(array: T[], id: number): boolean{
        let index = array.findIndex(e => e.id == id);
        if(index > -1)
        {
          array.splice(index, 1);
          return true;
        }
        return false;
      }
    
      static removeFromArray<T>(array: T[], value: any): boolean{
        let index = array.findIndex(v => v == value);
        if(index > -1)
        {
          array.splice(index, 1);
          return true;
        }
        return false;
      }
    
      static containsElement(array: number[], value: number) {
        return array.findIndex(e => e == value) > -1;
      }
}
