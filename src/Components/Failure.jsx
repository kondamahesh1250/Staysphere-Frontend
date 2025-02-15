import React from 'react'

export const Failure = ({ message }) => {

  const styling = {
    color: 'red',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center'
  }
  return (
    <div style={styling}>
      <div>{message}</div>
    </div>
  )
}
