import { useEffect, useState } from "react";
import CacheItem from "./cache-item";

export default function CacheList() {

  let [listState, setListState] = useState([]);

  useEffect(() => {
    electron.loadFiles(name).then(c => setListState(c));
  }, []);

return <ul>{listState.map(item => (<CacheItem key={item} name={item}></CacheItem>))}</ul>;
}
