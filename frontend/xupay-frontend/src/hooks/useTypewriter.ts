import { useEffect, useState, useRef } from 'react'

interface UseTypewriterOptions {
  typeSpeed?: number
  deleteSpeed?: number
  pause?: number
  loop?: boolean
}

export default function useTypewriter(
  words: string[],
  { typeSpeed = 80, deleteSpeed = 40, pause = 1500, loop = true }: UseTypewriterOptions = {}
) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (!words || words.length === 0) return

    const current = words[index % words.length]

    let timer: NodeJS.Timeout

    if (!isDeleting) {
      // Type forward
      timer = setTimeout(() => {
        if (!mounted.current) return
        setText(current.slice(0, text.length + 1))
        if (text.length + 1 === current.length) {
          // pause before deleting
          timer = setTimeout(() => {
            if (!mounted.current) return
            setIsDeleting(true)
          }, pause)
        }
      }, typeSpeed)
    } else {
      // Deleting
      timer = setTimeout(() => {
        if (!mounted.current) return
        setText(current.slice(0, text.length - 1))
        if (text.length - 1 === 0) {
          setIsDeleting(false)
          setIndex((i) => i + 1)
          if (!loop && index + 1 >= words.length) {
            // stop updating
          }
        }
      }, deleteSpeed)
    }

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isDeleting, index, words, typeSpeed, deleteSpeed, pause, loop])

  return {
    text,
    index,
    isDeleting,
  }
}
