import { ListMap } from "../../../common/utils";

export default function DependencyManager() {
  const obj = {
    newWork: new ListMap(),
    byPointer: new ListMap(),
    add: (key, pointer, ilink, payload) => {
      const job = {key, pointer, ilink, payload};
      obj.newWork.push(pointer.hashableName, job);
      obj.byPointer.push(pointer.hashableName, job);
      ilink.dependencies.push(key, job);
    },
    getForPointer: pointer => obj.byPointer.get(pointer.hashableName),
    fulfil: (pointer) => {
      obj.newWork.remove(pointer.hashableName);
      const jobs = obj.byPointer.get(pointer.hashableName);
      obj.byPointer.remove(pointer.hashableName);
      jobs.forEach(job => {
        ilink.dependencies.removeItem(job);
      });

      return jobs;
    }
  };

  return obj;
}
