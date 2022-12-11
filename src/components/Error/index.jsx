import React from 'react'
import './error.css'

const Error = () => {
  return (
    <div className='error'>
       <h3>
        Hey! Something's off!<br />
        We couldn't display the given data.
       </h3>
       <p>Try changing your filters or selecting a different date.</p>
    </div>
  )
}

export default Error