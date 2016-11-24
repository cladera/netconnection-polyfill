export function getObjectMethods(obj, excludeConstructor = true) {
  let props = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

  return props.sort().filter(function(e, i, arr) {
    if (excludeConstructor && e === 'constructor') return false;
    if (e!=arr[i+1] && typeof obj[e] == 'function') return true;
  });
}