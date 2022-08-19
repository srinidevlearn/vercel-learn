const filterBasedOnProjectionKeys = (projections,item) =>{
 return  Object.fromEntries(
    Object.entries(item).filter((i) => projections.includes(i[0]) && i)
  );
}

module.exports = { filterBasedOnProjectionKeys };
