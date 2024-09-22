import { useEffect, useState } from "react";

export default function CacheItem({name}) {

  let [contentState, setContentState] = useState("");

  useEffect(() => {
    electron.loadFile(name).then(c => setContentState(c));
  }, []);

  return (<li>{contentState}</li>);
}
