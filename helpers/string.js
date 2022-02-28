export const handlePrice = value => `${Number(value).toLocaleString('en')} đ`

export const getActiveLinkByPathName = pathname => {
  if (pathname.includes('/look-file')) {
    return {
      name: 'Hồ sơ nhìn',
      key: 2,
      url: '/look-file'
    }
  }
  if (pathname.includes('/audio-file')) {
    return {
      name: 'Hồ sơ nghe, nhìn',
      key: 3,
      url: '/audio-file'
    }
  }
  return {
    name: 'Hồ sơ giấy',
    key: 1,
    url: '/paper-file'
  }
}

export const filterSelect = (value, option, labelKey = 'children') => {
  const valueNoMark = convertText(value)
  const nameNoMark = convertText(option[labelKey])
  return !!nameNoMark.includes(valueNoMark)
}

export function convertText(text) {
  if (!text) return ''
  let newText = text
  newText = newText?.toLocaleLowerCase()
  newText = replaceAccentedCharactersByLowerCase(newText)
  return newText
}

function replaceAccentedCharactersByLowerCase(inputValue) {
  let content = inputValue
  content = content.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  content = content.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  content = content.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  content = content.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  content = content.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  content = content.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  content = content.replace(/đ/g, 'd')

  return content
}
