//from https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values

function sortArrayOfObjects(arrayToSort, key)
{
  function compareObjects(a, b) {
    if (a[key] < b[key])
      return -1;
    if (a[key] > b[key])
      return 1;
    return 0;
  }
  return arrayToSort.sort(compareObjects);
}

//use as sortArrayOfObjects(yourArray, "distance");
module.exports= sortArrayOfObjects;