import React from 'react'

export const Failure = ({ message }) => {

  const styling = {
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"20vh",
    color: 'red',
    fontWeight: 'bold',    
  }
  return (
    <div style={styling}>
      <p style={{ fontSize: "30px" }}>{message}</p>
    </div>
  )
}
