// Custom Array.prototype.reduce implementation
Array.prototype.myReduce = function (callback, initialValue) {
  let array = this;
  let accumulator = initialValue;
  let startIndex = 0;

  if(accumulator === undefined){
    if(array.length === 0){
        throw new Error("message: Reduce of empty array with no initial value");
    }
    accumulator = array[0];
    startIndex = 1;
  }

  for(let i=startIndex; i<array.length; i ++){
    accumulator = callback(accumulator,array[i],array,i);
  }
  return accumulator;
};

const nums = [1, 2, 3, 4];

const sum = nums.myReduce((acc, curr) => acc + curr, 0);
console.log(sum);