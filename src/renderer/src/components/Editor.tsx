import { useState } from 'react'
import pinyin from 'pinyin'
import './Editor.css'

const Editor = (): JSX.Element => {
  const [text, setText] = useState('')
  const [pinyinText, setPinyinText] = useState('')

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newText = e.target.value
    setText(newText)
    const pinyinResult = pinyin(newText, {
      style: pinyin.STYLE_TONE,
      heteronym: false,
    })
    const pinyinString = pinyinResult.map((item) => item[0]).join(' ')
    setPinyinText(pinyinString)
  }

  const renderAlignedText = (): JSX.Element => {
    const chars = text.split('')
    const pinyinWords = pinyinText.split(' ')
    
    return (
      <div className="aligned-text">
        {chars.map((char, index) => (
          <div key={`char-group-${index}`} className="char-group">
            <span className="pinyin-char">{pinyinWords[index] || ''}</span>
            <span className="chinese-char">{char}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="editor-container">
      <div className="paper-container">
        <div className="pinyin-display">
          <h3>结果：</h3>
          {renderAlignedText()}
        </div>
        <div className="editor-wrapper">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="输入中文文本..."
            className="text-editor"
          />
        </div>
      </div>
    </div>
  )
}

export default Editor 