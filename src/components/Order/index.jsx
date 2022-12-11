import React, {useEffect, useRef, useState} from 'react'

import './order.css'

const Order = ({data, cols, onClick, show}) => {

    const groups = [
        {
            title : 'shown',
            items: data
        },
        {
            title : 'hidden',
            items: []
        }
        
    ]

    const searchParams = new URLSearchParams(document.location.search)

    const [list, setList] = useState(groups)
    const [col, setCol] = useState(cols)
    const [dragging, setDragging] = useState(false)
    const dragItem = useRef()
    const dragNode = useRef()

    useEffect(() => {
        if(JSON.parse(searchParams.get('hiddenColumns'))){
            const hidden = (JSON.parse(searchParams.get('hiddenColumns')))
            let show =  data
            show = show.filter( function( item ) {
                for( var i=0, len=hidden.length; i<len; i++ ){
                    if( hidden[i].name == item.name ) {
                        return false;
                    }
                }
                return true;
            });
          
         
            let tempList = [
                {
                    title : 'shown',
                    items: show
                },
                {
                    title : 'hidden',
                    items: hidden
                }
            ]

            setList(tempList)
            onClick(tempList[0].items, col, tempList[1].items, false)
          }
    }, []);


  

 
    const handleDragStart = (e, params) => {
        dragItem.current = params
        dragNode.current = e.target;
        dragNode.current.addEventListener('dragend', handleDragEnd)
        setTimeout(() => {
            setDragging(true)
        }, 0)
    }

    const handleDragEnd = () => {
        setDragging(false)
        dragNode.current.removeEventListener('dragend', handleDragEnd)
        dragItem.current = null
        dragNode.current = null;
    }

    const handleDragEnter = (e, params) => {
        const currentItem = dragItem.current
        if(e.target !== dragNode.current){
            setList(oldList => {
                let newList = JSON.parse(JSON.stringify(oldList))
               
                    newList[params.grpI].items.splice(params.itemI, 0, newList[currentItem.grpI].items.splice(currentItem.itemI,1)[0])
                    dragItem.current = params
                
                return newList
            })
           
            setCol(oldCols => {
            let newCols = JSON.parse(JSON.stringify(oldCols))
            newCols.forEach((item) => {
                item.splice(params.itemI, 0, item.splice(currentItem.itemI,1)[0])
            })
            dragItem.current = params
                
                return newCols
        })
        }
    }

    const getStyles = (params) => {
        const currentItem = dragItem.current;
        if(currentItem.grpI === params.grpI && currentItem.itemI === params.itemI){
            return 'current column'
        }
        return 'column'
    }

    
  return (
    <>
    <div >
        {
            list.map((grp, grpI) => {
              return  <div className='parentOrder' onDragEnter={dragging && !grp.items.length ? (e) => handleDragEnter(e, {grpI, itemI:0}) : null}>
                    <h4>{grpI === 0 ? 'Shown ' : 'Hidden (Drag here to hide column)'}</h4>
                    <div className='order'>
                {grp.items.map((item, itemI) => {
     return (
        <div
         className={dragging ? getStyles({grpI,itemI}) : 'column'} draggable onDragStart={(e) => {
            handleDragStart(e, {grpI,itemI})
        }}
        onDragEnter = {dragging ? (e) => {handleDragEnter(e, {grpI, itemI})}:null}
       
        >
            <p>{item.label}</p>
        </div>
    )
    
                }
                )
                }
           </div>
                </div>
            } )
        }
         
    </div>

    <div className="buttons">
    <div className="cta" onClick={() => {
        onClick(list[0].items, col, list[1].items, false)
        }}>
        <p>Apply</p>
    </div>
    <div className="close">
        <p onClick={() => show(false)}>Close</p>
    </div>
    </div>
    </>
  )
}

export default Order