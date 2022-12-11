import React, { useEffect } from 'react'
import { useCallback, useContext } from 'react';
import {FaFilter} from 'react-icons/fa'
import { DisplayContext } from '../../contexts/displayContext'
import { useState } from 'react'
import SortButton from '../SortButton';
import { RangeSlider } from 'rsuite';
import {CopyToClipboard} from 'react-copy-to-clipboard';

import './table.css'
import Error from '../Error';

const Table = ({data, list, error, settings}) => {

    const {hiddenColumns} = useContext(DisplayContext)
    const searchParams = new URLSearchParams(document.location.search)

    const [sortKey, setSortkey] = useState(1);
    const [sortOrder, setSortOrder] = useState("asc")
    const [showFilter, setShowFilter] = useState(new Array(list.length).fill(false))
    const [range, setRange] = useState({min: 0, max :1100000})
    const [ranging, setRanging] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        if(JSON.parse(searchParams.get('sortKey'))){
            setSortkey(JSON.parse(searchParams.get('sortKey')))
          }
    
          if(JSON.parse(searchParams.get('range'))){
            setRange(JSON.parse(searchParams.get('range')))
          }
    
          if(JSON.parse(searchParams.get('sortOrder'))){
            setSortOrder(JSON.parse(searchParams.get('sortOrder')))
          }
    
    }, []);


   
    
    function sortData ({tableData, sortKey, reverse, i}){
        let sortedData = data
    sortedData = data.sort((a, b) => {
            return a[sortKey][1] > b[sortKey][1] ? 1 : -1
        })

      
            sortedData = sortedData.filter(function(item) {
                return (item[sortKey][1] > range.min && item[sortKey][1] < range.max);
              });
              
        
        if (reverse){
            return sortedData.reverse()
        }
        return sortedData
    }

    const sortedData = useCallback(() => sortData({tableData : data, sortKey, reverse: sortOrder === "des"}), 
    [
        data, sortKey, sortOrder, ranging
    ])

    function changeSort (key){
        setSortOrder(sortOrder === 'asc' ? 'des' : 'asc')
        setSortkey(key)
    }


    function triggerFilter(index){
        let result = [...showFilter];
        if(result.indexOf(true) === index){
            result[index] = false;         
        }else{
   result= result.map(x => false); // reset previous click
   result[index] = true;}
   setShowFilter(result);
    }

    function applyRange(i){
        setRanging(ranging ? false : true)
        setSortkey(i)
    }


  return (
    <>
     {error ? 
    <Error />    :
    <div className='tableContainer'>

        <table className='analyticsTable'>
    <thead>
    <tr>
       {
       list.map((item, i) => {
        return  (<><th >
            <div className="filter" onClick={() => triggerFilter(i)}>
            <FaFilter />
            </div>
            {item.label}
        <SortButton columnKey={item.key}
        onClick = {() => {
            changeSort(item.key)
        }}
        {...{sortOrder, sortKey}}
        />
        { showFilter[i] &&
        <div className="slider">
         <RangeSlider onChange={(v) => setRange({min: v[0], max: v[1]})} defaultValue={[0, 1100000]} min = {0} max = {1100000} />
         <p onClick={() => applyRange(item.key)}>Apply</p>
         </div>
       }
        </th>

         </>)
       })
       }
    </tr>
    </thead>
    <tbody>
    {
        sortedData().map((item) => {
            return (
            <tr>         
                    {
                        item.map((el, i) => {
                           return( <td className={hiddenColumns?.filter(e => e.name === el[0]).length > 0 ? 'hidden' : ''}> 
                            {
                                el[0] === 'date' ?
                                el[1].substring(0, 10)
                                :
                                el[0] === 'revenue' ?
                                "$" + Number((el[1]).toFixed(2))
                                :
                                el[0] === 'fillRate' || el[0] === 'ctr' ?
                                el[1] + '%' :
                                el[0] === 'responses' || el[0] === 'requests' ?
                                el[1].toLocaleString()
                                :
                                el[1].toLocaleString()
                            }
                                </td>)
                          
                        })
                    }
               
            </tr>
            )
        })
}
    
    </tbody>
   
        </table>
        <div className="copy">
        <CopyToClipboard text={`https://sparkly-granita-eeaa3e.netlify.app?settings=${JSON.stringify(settings)}&sortKey=${JSON.stringify(sortKey)}
        &range=${JSON.stringify(range)}&sortOrder=${JSON.stringify(sortOrder)}&hiddenColumns=${JSON.stringify(hiddenColumns)}`}
          onCopy={() => setCopied(true)}
          >
          <p className='copyBtn'>Get Sharable Link</p>
        </CopyToClipboard>
        {
            copied &&
            <p>Copied with data!</p>
        }
        </div>
    </div>
}

    </>
  )
}

export default Table