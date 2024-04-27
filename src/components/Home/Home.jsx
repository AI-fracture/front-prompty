import React from 'react'
import './Home.css'
import { ChatBody } from '../ChatBody/ChatBody'
import { Shape } from '../shape/Shape'

export function Home(props) {
    

    return (
        <>


<div className='home' id='flex-container'>


<div className='chatbody'>
<Shape/>
<ChatBody/>

</div>


<div className='validation'></div>
<div className='textbox'></div>


</div>
        </>
    )
}
