export function       
//防抖操作
debounce(func,delay){
  let timer = null
  return function(...arge){
    if(timer) clearTimeout(timer)
    timer = setTimeout(() =>{
      func.apply(this,arge)
    },delay)
  }
}