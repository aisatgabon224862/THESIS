function Two(num, tar) {
  let map = {};
  for (let i = 0; i < num.length; i++) {
    const target = tar - [num[i]];
    if (map[target] !== undefined) {
      return [map[target], i];
    }
    map[num[i]] = i;
  }
}
console.log(Two([1, 2, 4, 1], 3));
