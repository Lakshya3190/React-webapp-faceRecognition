import React from 'react';
import './imagelinkform.css';


const ImageLinkForm = ({onInputChange, onButtonSubmit}) =>
{
    return(
        <div className = ''>
                <p className = 'f3'>
                    {'This application will detect faces in your pictures'}
                </p>
            <div className = ' center'>
                <div className = ' form input center pa4 b3 shadow-2'>
                    <input className = 'text fe4 pa2 w-70 center' onChange= {onInputChange}/>
                    
                    <button 
                        className = 'w-30 grow link f4 ph3 pv2 dib white bg-light-purple'
                        onClick = {onButtonSubmit} > Detect </button>
                 </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;