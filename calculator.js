
var numberRegex = /[\d.]/;

const Buttons = [
  {
    value: "AC",
    type: "jumbo",
    keyCode: [8,46]
  },
  {
    value: "/",
    type: "regular",
    keyCode: [191,111]
  },
  {
    value: "X",
    type: "regular",
    keyCode: [88, 56, 106]
  },
  {
    value: "1",
    type: "regular",
    keyCode: [49,97]
    
  },
  {
    value: "2",
    type: "regular",
    keyCode: [50,98]
  },
  {
    value: "3",
    type: "regular" ,
    keyCode: [51,99]
  },
  {
    value: "-",
    type: "regular",
    keyCode: [189,109]
  },
  {
    value: "4",
    type: "regular",
    keyCode: [52,100]
  },
  {
    value: "5",
    type: "regular",
    keyCode: [53,101]
  },
  {
    value: "6",
    type: "regular",
    keyCode: [54,102]
  },
  {
    value: "+",
    type: "regular",
    keyCode: [187,107]
  },
  {
    value: "7",
    type: "regular",
    keyCode: [55,103]
  },
  {
    value: "8",
    type: "regular",
    keyCode: [56,104]
  },
  {
    value: "9",
    type: "regular",
    keyCode: [57,105]
  },
  {
    value: "+",
    type: "regular",
    keyCode: [187,107]
  },
  {
    value: "0",
    type: "jumbo",
    keyCode: [96,48]
  },
  {
    value: ".",
    type: "regular",
    keyCode: [190,110]
  },
    {
    value: "=",
    type: "regular",
    keyCode: [13,187]
  }   
];

class CalcButton extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      activity: "inactive",
    }
    this.handleDisplayChange = this.handleDisplayChange.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }
  componentDidMount(){
    document.addEventListener("keydown", this.handleButtonPress);
  }
  componentWillUnmount() {
   document.removeEventListener('keydown', this.handleButtonPress);
 }
  handleButtonPress(event){
    if(this.props.keyCode.includes(event.keyCode)){
    this.handleDisplayChange()
    }
  }
  handleDisplayChange(){
    this.props.changeDisplay(this.props.value); 
    this.setState({
      activity: "active"
    })
     setTimeout(() =>
     this.setState({
       activity :"inactive"
     }), 100);
  }
  render(){
    var inactive = <button className = {this.props.type} onClick = {this.handleDisplayChange}>{this.props.value}</button>;
    var active = <button className = {this.props.type + "P"} onClick = {this.handleDisplayChange}>{this.props.value}</button>;
    return(
      <>
        {this.state.activity === "inactive" ? inactive : active}
      </>
      )
  }
  
  
}

class ButtonContainer extends React.Component{
  constructor(props){
    super(props);
  }  
  render(){
      var items = this.props.buttons.map(i => {return(<CalcButton
      type = {i.type}
      value = {i.value}
      keyCode = {i.keyCode}                                                 
      changeDisplay = {this.props.changeDisplay}                                                 />);})
    return(<div class = "buttonC">
        {items}
      
      </div>)     
  }
  
  
}

class Display extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(<div className = "display">{this.props.displayS}</div>);
  }
  
}


class Formula extends React.Component{
  constructor(props){
    super(props);
  }
  render(){
    return(<div className = "formula">{this.props.formulaS}</div>)    
  } 
}



class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      formulaS: " ",
      displayS: "0",
      buttons: Buttons,
      toBeReset: false,
      onOperation: false
    }
    this.changeDisplay = this.changeDisplay.bind(this);
    this.calculate = this.calculate.bind(this);
    
  }
  calculate(){
    var operations = {
      "+" : function(x,y){return(x + y)},
      "-" : function(x,y){return(x - y)},
      "X" : function(x,y){return(x * y)},
      "/" : function(x,y){return(x / y)},
      "=" : function(x,y){console.log("this is a bug")}
    };
    var curr = this.state.formulaS;

    var whiteSpace = /[^ \d.]+/g; 
    var numRegex = /[\d.]+/g;
    var result = curr.match(numRegex);
    var result2 = curr.match(whiteSpace);
    if(result2 == null){
      result2 = [];
    }
    if(this.state.onOperation){
      result2.pop();    
    }
    for(var i = 0; i < result2.length; i++){
      if(result2[i] == "X" || result2[i]=="/"){
        var temp1 = operations[result2[i]](parseFloat(result[i]) , parseFloat(result[i+1])); 
        result.splice(i, 2, temp1);
        result2.splice(i, 1);
        i = -1;
      }     
    }
    for(var i = 0; i < result2.length; i++){
      var temp = operations[result2[i]](parseFloat(result[0]) , parseFloat(result[1])); 
      result.splice(0,2,temp);
    };
    return(parseFloat(result) + "")
    
    
    
    
    
    
    
  }
  changeDisplay(pressed){
    var noNum = /[\D]+/g
    var noEqual = /[=]+/g 
    var hasDot = /[.]+/g
    if(this.state.toBeReset){ // if number completely reset if not then keep and do this. add later
       this.setState((state,props) => {
        var check = false;
        var dVal = noNum.test(state.displayS)?  " ": state.displayS;
        if(noEqual.test(state.formulaS)){
          check = true;
        }
        var intermediate = state.displayS;
        if(numberRegex.test(pressed)){
           intermediate = " "
        }
        // if a new is not a number
        var fVal = state.formulaS;
        if(check){
          fVal = intermediate;
          dVal = "";
        }       
        return {
        formulaS:  fVal,
        displayS:  dVal,
        toBeReset: false
      }}); 
      
    }
    if(numberRegex.test(pressed)){
      if(pressed == "." && hasDot.test(this.state.displayS)){
        return;
      }
      this.setState((state,props) => {
        if(state.displayS == "0"){ 
          var result =  state.formulaS == "0" ? {displayS: pressed, formulaS: pressed } : {displayS: pressed, formulaS: state.formulaS + " " + pressed}
          return result;
        }else{
        return {displayS: state.displayS + pressed, formulaS: state.formulaS + pressed, onOperation: false};
        }
       });
    }
    else if(pressed == "AC"){
      this.setState({
        displayS: "0",
        formulaS: "0",
        onOperation: false
      });
    }
    else if(pressed == "="){ 
        //check last char if number if it is continue if not return
      this.setState((state,props) => {
        var result = this.calculate()
        var temp = state.formulaS;
        if(state.onOperation){
          temp = state.formulaS.substring(0, state.formulaS.length - 2);
        }
        return{
        displayS: result,
        formulaS: temp + " " + pressed + " " + result,
        toBeReset : true,
        onOperation: false
        }
      })
     
    }
    else{
       if(this.state.onOperation) return;
       this.setState((state,props) => {     
        return {
        displayS:  pressed,
        formulaS:  state.formulaS + " " + pressed + " ",
        toBeReset : true,
        onOperation: true
      }}); 
      
    }
  }
    
  render(){
   return (<div>
      <div className = "title text-center"> <i className="fas fa-calculator"></i>  Javascript Calculator </div>
       <div className ="text-center subtitle"> created and designed by Eric Feng </div>
       <div className = "outer"> 

         <Formula formulaS={this.state.formulaS}/>
         <Display displayS = {this.state.displayS}/>
         <ButtonContainer  
           buttons = {this.state.buttons}
           changeDisplay = {this.changeDisplay}
           />
         
         
       </div>
    </div>);
  }
}








ReactDOM.render(<App/>, document.getElementById("root"))