import React from 'react'
import {FaAngleUp} from 'react-icons/fa'
import './sortButton.css'

const SortButton = ({sortOrder, columnKey, sortKey, onClick}) => {
  return (
    <div onClick={onClick} className = {`${sortKey === columnKey && sortOrder === 'des' ? 'sortButton sortReverse' : 'sortButton'}`}><FaAngleUp /></div>
  )
}

export default SortButton