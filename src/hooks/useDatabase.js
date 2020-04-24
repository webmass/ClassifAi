import { useState } from 'react';
import Database from 'services/Database';
import { DB_OBJECT_STORES } from 'app/constants';

const useDatabase = (table, key, initialValue = null) => {
  const [storedValue, setStoredValue] = useState(async () => {
    const dbResult = await Database.getItem(table, key);
    return dbResult !== null ? dbResult : initialValue;
  });

  const setValue = (value) => {
    setStoredValue(value);
    const objectStore = DB_OBJECT_STORES.find(objectStore => objectStore.name === table);
    console.log(value);
    Database.saveItem(table, {[objectStore.keyPath]: key, ...value});
  };

  return [storedValue, setValue];
};

export default useDatabase;
