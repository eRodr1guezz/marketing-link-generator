import { Chip } from '@mui/material'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DeleteOutlined } from '@mui/icons-material'
import { socialIconHandler } from '../Utils'

export function CustomChip({ vals, selectedTypes, setSelectedTypes, dispatchHandler }) {
  const [uniqueId, setUniqueId] = useState()
  
  useEffect(() => {
    let id = uuidv4()
    setUniqueId(id)
  },[])

  return ( 
    <Chip
      deleteIcon={<DeleteOutlined 
      onMouseDown={e => e.stopPropagation()} 
    />}
    clickable
    onDelete={() => {
      let filtered = selectedTypes.filter(el => el !== vals)
      setSelectedTypes(filtered)

      dispatchHandler({ type: 'removeUrl', id: uniqueId})
    }}
    color={"secondary"}
    icon={socialIconHandler(vals)}
    label={vals}
  />
  )
}