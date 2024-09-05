import React, { useEffect, useState } from 'react';
import './App.css'
function App() {
  const [filteredItem,setFilteredItem]=useState([]);
  const [searchData,setSearchData]=useState('');
  useEffect(()=>{
    async function fetchData(){
      try{
        await fetch(`
          https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false
        `).then(res=>res.json())
        .then(data=>setFilteredItem(data));
      }
      catch(err){
        console.log('Error while fetching data')
      }
    }
    fetchData();
  },[]);
  
  const hadleSortbyMktCap=()=>{
    const sortedData=[...filteredItem].sort(
      (a,b)=> b.market_cap - a.market_cap
    );
    setFilteredItem(sortedData)
  }

  const hadleSortbyPercentage=()=>{
    const sortedData=[...filteredItem].sort(
      (a,b)=> b.market_cap_change_percentage_24h - a.market_cap_change_percentage_24h
    );
    setFilteredItem(sortedData)
  }
  return (
    <div>
      <div className='topContainer'>
        <input type="text" placeholder='Search by Name or Symbol' onChange={(e)=>setSearchData(e.target.value)}/>
        <button onClick={hadleSortbyMktCap}>Sort By Mkt Cap</button>
        <button onClick={hadleSortbyPercentage}>Sort by Percentage</button>
      </div>
      <table>
        <tbody>
          {filteredItem.filter((data)=>{
            return (searchData===''? data : (data.name.toLowerCase().includes(searchData.toLowerCase()) || data.symbol.toLowerCase().includes(searchData.toLowerCase())))
          }).map((data)=>(
            <tr key={data.id}>
              <td><img src={data.image} alt="dataimage" width="40"/></td>
              <td>{data.name}</td>
              <td>{data.symbol.toUpperCase()}</td>
              <td>${data.current_price}</td>
              <td>${data.total_volume}</td>
              <td style={{
                color : data.market_cap_change_percentage_24h<0 ? 'red' :'green'
              }}>{data.market_cap_change_percentage_24h.toFixed(2)}%</td>
              <td>Mkt Cap:${data.market_cap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}

export default App;
