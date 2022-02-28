export const exportExcelURL = res => {
  return window.open(`https://hethongluutru.xyz${res}`)
  // return window.open(`${process.env.REACT_APP_DOMAIN}${res}`)
}
