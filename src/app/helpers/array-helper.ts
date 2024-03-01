import { BaseId } from "../models/base/base-id";

export class ArrayHelper {

  //Get the next Id past the latest Id in the array
  static nextId<T extends BaseId>(array: T[]): number{
      let indexes = array.map(e => e.id);
      let sortedIndexes = indexes.sort();
      let id = sortedIndexes.pop();

      let currentId = id ?? -1;
      return currentId + 1;
    }
    
    //Get the element with the provided Id
    static selectById<T extends BaseId>(array: T[], id: number): T | undefined{
      return array.find(e => e.id == id);
    }
    
    //Removes the element with the provided Id
    static removeById<T extends BaseId>(array: T[], id: number): boolean{
      let index = array.findIndex(e => e.id == id);
      if(index > -1)
      {
        array.splice(index, 1);
        return true;
      }
      return false;
    }
    
    //Removes elemnt from the array given they share a value
    static removeFromArray<T>(array: T[], value: any): boolean{
      let index = array.findIndex(v => v == value);
      if(index > -1)
      {
        array.splice(index, 1);
        return true;
      }
      return false;
    }
    
    //Checks if an array contains an element. Returns true if so
    //else returns false
    static containsElement(array: number[], value: number) {
      return array.findIndex(e => e == value) > -1;
    }
}
