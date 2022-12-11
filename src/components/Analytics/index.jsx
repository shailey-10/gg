import React, {useState, useEffect, useContext} from 'react'
import {FaCog} from 'react-icons/fa'
import Loader from '../Loader'
import Table from '../Table'
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { DisplayContext } from '../../contexts/displayContext';
import Order from '../Order';
import Error from '../Error';

import './analytics.css'
const Analytics = () => {

    const {setHiddenColumns} = useContext(DisplayContext)


    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [startDate, setStartDate] = useState('2021-05-01')
    const [endDate, setEndDate] = useState('2021-05-03')
    const [error, setError] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const elements = [
        {key : 0, label :'Date', name: 'date'},
        {key : 1, label :'App', name: 'app_id'},
        {key : 2, label :'Ad Request', name: 'requests'},
        {key : 3, label :'Ad Response', name: 'responses'},
        {key : 4, label :'Impression', name: 'impressions'},
        {key : 5, label :'Clicks', name: 'clicks'},
        {key : 6, label :'Revenue', name: 'revenue'},
        {key : 7, label :'Fill rate', name: 'fillRate'},
        {key : 8, label :'CTR', name: 'ctr'},
    ]



    const [headings, setHeadings] = useState(elements)

    const searchParams = new URLSearchParams(document.location.search)

    
        console.log(JSON.parse(searchParams.get('settings')));
    


    useEffect(() => {
        setError(false)
        if(JSON.parse(searchParams.get('settings'))){
          setShowSettings(JSON.parse(searchParams.get('settings')))
          console.log('setting')
        }
        const cache = localStorage.getItem(`${startDate}-${endDate}`)
      
        if(cache != null){
          const dat = JSON.parse(cache)
          setData(dat)
        }else{
        fetch(`http://go-dev.greedygame.com/v3/dummy/report?startDate=${startDate}&endDate=${endDate}`)
        .then((response) => response.json())
  .then((data) => {
    let temp = data.data;
    temp.forEach((item) => {
        item.fillRate = (item.requests / item.responses * 100).toFixed(2)
        item.ctr = (item.clicks / item.impressions * 100).toFixed(2)
    });
    let arrayData =[]

    temp.forEach((item) => {
      const entries = Object.entries(item);
      arrayData.push(entries)
    })
    localStorage.setItem(`${startDate}-${endDate}`, JSON.stringify(arrayData))
    setData(arrayData)
    if(arrayData.length === 0){
      setError(true)
    }
})
  .catch((error) => {
    console.log(error)
    setError(true)
  })}
    }, [startDate, endDate])

    useEffect(() => {
        if(data){
       setLoading(false)
    }
    }, [data])

    function setDate(d) {
        let start = new Date(d[0]).toISOString().substring(0,10)
        let end = new Date(d[1]).toISOString().substring(0,10)
        setStartDate(start)
        setEndDate(end)
    }

    function check(order, col, list, show) {
      console.log(order)
   
      setError(show)
      if(order.length === 0){
        setError(true)
      }
        setHeadings(order)
        setData(col)
        setHiddenColumns(list)
    }

    function displaySettings() {
      setShowSettings(showSettings ? false : true)
    }

  return (
    <div className='parentAnalytics'>
        {
            loading ?
            <Loader />
            :
         
            <>
            <div className="settings">
            <DateRangePicker placeholder = {'2021-05-01 - 2021-05-03'} onOk ={(d) => setDate(d)}/>
            <p onClick={displaySettings}><FaCog />   Settings</p>
            </div>

            { showSettings &&
              <Order  data = {headings} show ={(show) => setShowSettings(show)} cols = {data} onClick = {(order, col, list, show) => check(order, col, list, show)} />
            }
        {
            data &&
            <Table error = {error} data = {data} list = {headings} settings = {showSettings} />
        }

        </>
    }
        
    </div>
  )
}

export default Analytics