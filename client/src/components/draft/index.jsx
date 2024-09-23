import React, { useState, useCallback } from 'react'
import { createEditor, Transforms, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const Toolbar = ({ format, onClick }) => (
  <div>
    <button onMouseDown={event => onClick(event, format)}>{format}</button>
  </div>
)

// Определите начальное состояние редактора
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }]
  }
]

// Проверка, применен ли формат
const isActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

// Функция для применения формата текста
const toggleFormat = (event, editor, format) => {
  event.preventDefault()
  const isActiveFormat = isActive(editor, format)
  Transforms.setNodes(
    editor,
    { [format]: !isActiveFormat },
    { match: Text.isText, split: true }
  )
}

const MyEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))

  // Обработчик изменения текста
  const handleChange = value => {
    console.log(value)
  }

  // Обработчик клика на кнопку форматирования
  const handleFormatClick = (event, format) => {
    toggleFormat(event, editor, format)
  }

  return (
    <div>
      <Toolbar format='bold' onClick={handleFormatClick} />
      <Slate editor={editor} value={initialValue} onChange={handleChange}>
        <Editable renderLeaf={props => <Leaf {...props} />} />
      </Slate>
    </div>
  )
}

// Функция для отображения форматированного текста
const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? 'bold' : 'normal'
      }}
    >
      {props.children}
    </span>
  )
}

export default MyEditor
