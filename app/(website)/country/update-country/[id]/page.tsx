import React from 'react'
import UpdateCountry from './_components/update-country'

const page = ({params}:{params:{id:string}}) => {
  return (
    <div>
        <UpdateCountry id={params.id}/>
    </div>
  )
}

export default page