import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import './App.css';
import getCfProblems from './cfProblemsGetter.js';

// see: https://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objectshttps://stackoverflow.com/questions/14446511/most-efficient-method-to-groupby-on-a-array-of-objects
var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

class Cell extends Component {
   render() {
      if(this.props.problem===null){
         return;
      }
      var cleared="not-tried";
      if(this.props.problem.correct_count>0){cleared="cleared";}
      else if(this.props.problem.submit_count>0){cleared="failed";}
      return(
            <li className={cleared}>
            <a href={this.props.problem.link} target="_blank" rel="noopener noreferrer">
               <div className="index">{this.props.problem.index}</div>
               <div className="submit-info">{this.props.problem.correct_count}/{this.props.problem.submit_count}</div>
            </a>
            </li>
            );
   }
}

class Row extends Component {
   render() {
      if(this.props.problems===null){
         return;
      }
      var lines = [];
      for(var i = 0 ; i < this.props.problems.length; i++){
         lines.push(<Cell problem={this.props.problems[i]} title={this.props.title} key={this.props.problems[i].name}/>);
      }
      return(
            <li className="row">
               <ul className="category">
               <li className="title" key={this.props.title}>{this.props.title}</li>
               {lines}
               </ul>
            </li>
            );
   }
}


class Board extends Component {
   render() {
      var groupedProblems = groupBy(this.props.problems, 'contestName');
      var lines = [];
      for(var key in groupedProblems){
         var groupKey = "group"+key;
         lines.push(<Row problems={groupedProblems[key]} title={key} key={groupKey}/>);
      }
      return (<ul>
              {lines}
              </ul>);
   }
}


class App extends Component {
  constructor(props){
     super(props);
     this.state = {
        problems: null
     }
     getCfProblems((problems) => this.afterInit(problems));
  }

  afterInit(problems){ 
//     var default_pattern = 'Educational Codeforces Round';
     var default_pattern = 'Educational Codeforces ';
     this.changefilter(problems, default_pattern); 
  }

  changefilter(problems, pattern){
     var filtered_problems = problems.filter(function(problem){
        return (problem.contestName.match(pattern) !== null );
     });
     var filtered_renamed_problems = filtered_problems.map(function(problem){
        problem.contestName = problem.contestName.replace(pattern, "");
        return problem
     });
     this.setState({
        problems : filtered_renamed_problems.reverse(),
     });
  }

  render() {
    //console.log("render" + this.state.problems);
    var contents = <ReactLoading type="spokes" height={'40%'} width={'40%'} />;
    if(this.state.problems !== null){
       contents = <Board problems={this.state.problems} />;
    }
       return (
             <div className="App">
                <div className="App-contents">
                {contents}
                </div>
             </div>
             );
  }
}

export default App;
