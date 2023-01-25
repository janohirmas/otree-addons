function isThere(sVar,defaultValue=undefined) {
    let actualVar;
    try {
      actualVar = eval(sVar);
    } catch (e) {
        console.log(e)
        if (e instanceof ReferenceError) {
            // Handle error as necessary
            actualVar = defaultValue;
        } 
    }
    if (actualVar === undefined) {actualVar = defaultValue}
    return actualVar
  }

  function replaceDefault(varAttr,defaultValue=undefined) {
    let actualVar=varAttr;
    if (actualVar===undefined){actualVar=defaultValue};
    return actualVar;
  }
