import { useState, useRef, useEffect } from 'react'
import { isChineseChar, convertToPinyin } from '../utils/pinyinUtils'
import './Editor.css'

interface ListItem {
  id: number
  text: string
  pinyin: string
}

const getPlaceholderText = (): string => {
  const platform = window.navigator.platform.toLowerCase()
  const isMac = platform.includes('mac')
  const shortcut = isMac ? 'Command+Enter' : 'Ctrl+Enter'
  return `输入文本，按 ${shortcut} 添加...`
}

const Editor = (): JSX.Element => {
  const [items, setItems] = useState<ListItem[]>([])
  const [currentText, setCurrentText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Focus the textarea when component mounts
    textareaRef.current?.focus()
  }, [])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const newText = e.target.value
    setCurrentText(newText)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    // Check for Ctrl+Enter (Windows) or Command+Enter (Mac)
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      const trimmedText = currentText.trim()
      if (trimmedText) {
        const textParts = trimmedText.split(/(?:\r\n|\n){2,}/).filter((part) => part.trim() !== '')
        const newItems = textParts.map((text, index) => ({
          id: items.length + index + 1,
          text: text.trim(),
          pinyin: convertToPinyin(text.trim())
        }))

        setItems([...items, ...newItems])
        setCurrentText('')
      }
    }
  }

  const renderAlignedText = (text: string, pinyinText: string): JSX.Element => {
    const lines = text.split('\n')
    const pinyinLines = pinyinText.split('\n')

    return (
      <div className="aligned-text">
        {lines.map((line, lineIndex) => {
          const chars = line.split('')
          const pinyinWords = pinyinLines[lineIndex]?.split(' ') || []
          let pinyinIndex = 0

          return (
            <div key={`line-${lineIndex}`} className="text-line">
              {chars.map((char, charIndex) => {
                const isChinese = isChineseChar(char)
                const pinyin = isChinese ? pinyinWords[pinyinIndex++] : ''

                return (
                  <div key={`char-group-${lineIndex}-${charIndex}`} className="char-group">
                    <span className="pinyin-char">{pinyin}</span>
                    <span className="chinese-char">{char}</span>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const handleDelete = (id: number): void => {
    setItems(
      items
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          id: index + 1
        }))
    )
  }

  return (
    <div className="editor-container">
      <div className="paper-container">
        <div className="pinyin-display">
          <h3>结果：</h3>
          {items.map((item) => (
            <div key={item.id} className="list-item">
              <span className="item-number">{item.id}.</span>
              {renderAlignedText(item.text, item.pinyin)}
              <span className="delete-icon" onClick={() => handleDelete(item.id)}>
                ×
              </span>
            </div>
          ))}
        </div>
        <div className="editor-wrapper">
          <textarea
            ref={textareaRef}
            className="text-editor"
            value={currentText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={getPlaceholderText()}
          />
        </div>
      </div>
    </div>
  )
}

export default Editor
