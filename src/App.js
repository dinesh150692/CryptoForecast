import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state={
      loading: true,
      loadingButton: false,
      coinsList: [],
      forecastList: [],
      code: '',
      error: ''
    }
  }

  componentWillMount(){
    this.fetchCoinList();
  }

  fetchCoinList(){
    fetch('https://infinite-depths.herokuapp.com/coins')
      .then(response => {return response.json()})
      .then(data => this.setState({coinsList : Object.keys(data.coins), loading:false}))
      .catch(error => this.setState({error: 'Error in fetching Coin Details, retry again...', loading:false}));
  }
  
  submit(){
    this.setState({forecastList: []});
    if(this.state.code === ''){
      this.setState({error: 'Crypto Code cannot be empty', loadingButton: false});
      return;
    }else{
      if(this.state.coinsList.indexOf(this.state.code) === -1){
        this.setState({error: 'Not a valid crypto code, retry with valid one...', loadingButton: false});
      }else{
        this.setState({ error: ''});
        this.fetchForecast();
      }
    }
  }

  fetchForecast(){
    fetch('https://infinite-depths.herokuapp.com/forecast?code=' + this.state.code)
      .then(response => {return response.json()})
      .then(data => {this.setState({forecastList: data.forecast, loadingButton:false})})
      .catch(error => this.setState({error: 'Error in fetching Coin Forecast, retry again...', loadingButton:false}));
  }

  getDate(date){
    return new Date(date).toString().substr(3, 12);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Crypto Currency Forecast</h1>
        </header>
        {this.state.loading && <div className="loadingSpinner margin"></div>}
        {!this.state.loading && 
          <div>
            <div className="flexiItem">
              <label className="label">Enter Crypto Code:</label>
              <input type="text" className="selectpicker" onChange={(event) => {this.setState({ code: event.target.value})}}/>
            </div>
            {this.state.error && 
              <label className="margintop error">{this.state.error}</label>
            }
            <div className="buttonContainer">
              {!this.state.loadingButton && <button className='button' onClick={() => this.setState({loadingButton: true},() => this.submit())}>Submit</button>}
              {this.state.loadingButton && <div className="loadingSpinner margin"></div> }
            </div>
           
            {this.state.forecastList.length > 0 && 
            <div className="tableContainer">
              <table>
                <thead>
                  <tr>
                    <td>Price in USD</td>
                    <td>When</td>
                  </tr>
                </thead>
                <tbody>
                  {this.state.forecastList.map(item => {
                    return(
                    <tr key={item.usd}>
                    <td>{item.usd}</td>
                    <td>{this.getDate(item.timestamp)}</td>
                  </tr>);
                  })}
                </tbody>
              </table>
            </div>
          }
        </div>
        }
      </div>
    );
  }
}

export default App;
