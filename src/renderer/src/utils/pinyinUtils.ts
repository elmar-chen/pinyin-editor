import pinyin from 'pinyin'

export const isChineseChar = (char: string): boolean => {
  return /[\u4e00-\u9fa5]/.test(char)
}

export const convertToPinyin = (text: string): string => {
  // Split text into lines and process each line separately
  const lines = text.split('\n')
  const processedLines = lines.map((line) => {
    // 创建一个字符数组，用于保存每个字符对应的拼音或原字符
    const charPinyinArray = [] as string[]

    // 遍历每个字符
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (isChineseChar(char)) {
        // 如果是中文字符，获取其拼音
        const pinyinForChar = pinyin(char, {
          style: pinyin.STYLE_TONE,
          heteronym: false
        })[0][0]
        charPinyinArray.push(pinyinForChar)
      } else {
        // 如果不是中文字符，保留原字符但不添加到最终结果
        charPinyinArray.push('')
      }
    }

    // 过滤掉空字符串并用空格连接
    return charPinyinArray.filter(Boolean).join(' ')
  })

  return processedLines.join('\n')
}
