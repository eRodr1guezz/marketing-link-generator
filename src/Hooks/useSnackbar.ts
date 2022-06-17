import { useState, useEffect } from 'react'

export default function useSnackbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [alertType, setAlertType] = useState('')

  useEffect(() => {
    if (isOpen === true) {
      setTimeout(() => setIsOpen(false), 3000)
    }
  }, [isOpen])

  function openSnackBar(msg: string, type: string) {
    setMessage(msg)
    setAlertType(type)
    setIsOpen(true)
  }

  return { isOpen, message, alertType, openSnackBar }
}

