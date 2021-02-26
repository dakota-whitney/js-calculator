import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentInput: [0],
      inputQueue: [],
      currentOperator: "",
      result: "",
      style: "",
      activeButton: ""
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.runCalculation = this.runCalculation.bind(this);
    this.toggleBtnStyle = this.toggleBtnStyle.bind(this);
  }
  componentDidMount() {
    const fccScript = document.createElement("script");
    fccScript.src =
      "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";
    fccScript.async = true;
    document.body.appendChild(fccScript);
    document.addEventListener("keydown", this.handleKeydown);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeydown);
  }
  handleKeydown(e) {
    console.log(e.code);
  }
  toggleBtnStyle(buttonId) {
    if (buttonId === "clear") {
      this.setState({
        style: clearActiveStyle
      });
      setTimeout(
        () =>
          this.setState({
            style: clearInactiveStyle
          }),
        100
      );
    } else {
      this.setState({
        style: activeStyle
      });
      setTimeout(
        () =>
          this.setState({
            style: inactiveStyle
          }),
        100
      );
    }
  }
  handleClick(e) {
    const endingOperator = /(\+|\-|\*|\/)$/gm;
    const startingZero = /^0/gm;
    const hasDecimal = /\./gm;

    //Set active button for style condition in Interface component
    this.setState({
      activeButton: e.target.id
    });

    //Find index of button clicked in Button Data object
    let buttonClicked =
      buttonData[buttonData.findIndex((button) => button.Id === e.target.id)];

    //Toggle button style for click
    this.toggleBtnStyle(buttonClicked.Id);

    //If "Clear" is clicked
    if (buttonClicked.Id === "clear") {
      console.log("Clear was clicked");
      this.setState({
        inputQueue: [],
        currentInput: [0],
        currentOperator: "",
        result: ""
      });
    }

    //If a number is clicked
    else if (buttonClicked.hasOwnProperty("Number")) {
      console.log(`${buttonClicked.Id} was clicked`); //Log button ID

      //If currentInput is at initialized state
      if (startingZero.test(this.state.currentInput.join(""))) {
        if (hasDecimal.test(this.state.currentInput.join(""))) {
          this.setState((state) => ({
            currentInput: [...state.currentInput, buttonClicked.Display],
            inputQueue: [...state.inputQueue, buttonClicked.Display]
          }));
        } else {
          this.setState((state) => ({
            currentInput: [buttonClicked.Display],
            inputQueue: [buttonClicked.Display]
          }));
        }
      }

      //Else if inputQueue ends with an operator
      else if (endingOperator.test(this.state.inputQueue.join(""))) {
        if (buttonClicked.Id !== "zero") {
          this.setState((state) => ({
            currentInput: [buttonClicked.Display],
            inputQueue: [...state.inputQueue, buttonClicked.Display]
          }));
        }
      }

      //Else append to current number
      else {
        this.setState((state) => ({
          currentInput: [...state.currentInput, buttonClicked.Display],
          inputQueue: [...state.inputQueue, buttonClicked.Display]
        }));
      }
      this.setState((state) => {
        console.log(`The current input is ${state.currentInput.join("")}`);
      });
    }

    //If decimal is clicked
    else if (buttonClicked.Id === "decimal") {
      console.log(`${buttonClicked.Id} was clicked`);

      if (!hasDecimal.test(this.state.currentInput.join(""))) {
        this.setState((state) => ({
          currentInput: [...state.currentInput, buttonClicked.Display],
          inputQueue: [...state.inputQueue, buttonClicked.Display]
        }));
      }
    }

    //If "Equals" is clicked
    else if (buttonClicked.Id === "equals") {
      if (!endingOperator.test(this.state.inputQueue.join(""))) {
        this.runCalculation();
      }
      console.log("Equals was clicked");
      this.setState((state) => ({
        currentOperator: "",
        inputQueue: [state.result],
        currentInput: [state.result]
      }));
    }

    //If an operator is clicked
    else {
      //If inputQueue doesn't end with an operator
      if (!endingOperator.test(this.state.inputQueue.join(""))) {
        this.runCalculation();
        this.setState((state) => ({
          currentInput: [state.result],
          currentOperator: buttonClicked.Display,
          inputQueue: [...state.inputQueue, buttonClicked.Display]
        }));
      }
    }
    this.setState((state) => {
      console.log(`Current operator is ${state.currentOperator}`);
    });
    this.setState((state) => {
      console.log(`Current result is ${state.result}`);
    });
  }
  runCalculation() {
    //On first run set result equal to currentInput
    if (this.state.result === "") {
      this.setState((state) => ({
        result: parseFloat(state.currentInput.join(""))
      }));
    }

    //If there was a previous calculation, perform corresponding operation
    else {
      switch (this.state.currentOperator) {
        case "+":
          this.setState((state) => ({
            result: state.result + parseFloat(state.currentInput.join(""))
          }));
          break;
        case "-":
          this.setState((state) => ({
            result: state.result - parseFloat(state.currentInput.join(""))
          }));
          break;
        case "*":
          this.setState((state) => ({
            result: state.result * parseFloat(state.currentInput.join(""))
          }));
          break;
        case "/":
          this.setState((state) => ({
            result: state.result / parseFloat(state.currentInput.join(""))
          }));
          break;
      }
    }
  }
  render() {
    return (
      <div className="container-fluid">
        <h1>Dakota's Virtual Calculator</h1>
        <h2>Developed in React.js</h2>
        <div id="outer-container">
          <Display
            currentInput={this.state.currentInput}
            inputQueue={this.state.inputQueue}
          />
          <Interface
            handleClick={this.handleClick}
            style={this.state.style}
            activeButton={this.state.activeButton}
          />
        </div>
      </div>
    );
  }
}

class Display extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="display-container">
        {this.props.inputQueue}
        <br />
        <div id="display">{this.props.currentInput}</div>
      </div>
    );
  }
}

class Interface extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const buttons = buttonData.map((button, i) => {
      if (button.Id === this.props.activeButton) {
        return (
          <div
            key={i}
            id={buttonData[i].Id}
            className="button"
            onClick={this.props.handleClick}
            style={this.props.style}
          >
            {button.Display}
          </div>
        );
      } else {
        return (
          <div
            key={i}
            id={buttonData[i].Id}
            className="button"
            onClick={this.props.handleClick}
          >
            {button.Display}
          </div>
        );
      }
    });
    return <div id="interface">{buttons}</div>;
  }
}

const buttonData = [
  {
    Number: 0,
    Display: "0",
    Id: "zero"
  },
  {
    Display: "+",
    Id: "add",
    Type: "Operator"
  },
  {
    Display: "-",
    Id: "subtract",
    Type: "Operator"
  },
  {
    Display: "*",
    Id: "multiply",
    Type: "Operator"
  },
  {
    Number: 1,
    Display: "1",
    Id: "one"
  },
  {
    Number: 2,
    Display: "2",
    Id: "two"
  },
  {
    Number: 3,
    Display: "3",
    Id: "three"
  },
  {
    Display: "/",
    Id: "divide",
    Type: "Operator"
  },
  {
    Number: 4,
    Display: "4",
    Id: "four"
  },
  {
    Number: 5,
    Display: "5",
    Id: "five"
  },
  {
    Number: 6,
    Display: "6",
    Id: "six"
  },
  {
    Display: "=",
    Id: "equals"
  },
  {
    Number: 7,
    Display: "7",
    Id: "seven"
  },
  {
    Number: 8,
    Display: "8",
    Id: "eight"
  },
  {
    Number: 9,
    Display: "9",
    Id: "nine"
  },
  {
    Display: ".",
    Id: "decimal"
  },
  {
    Display: "Clear",
    Id: "clear"
  }
];

const activeStyle = {
  backgroundColor: "white",
  color: "#000033"
};

const clearActiveStyle = {
  backgroundColor: "white",
  color: "red"
};

const inactiveStyle = {
  backgroundColor: "#000033",
  color: "white"
};

const clearInactiveStyle = {
  backgroundColor: "red",
  color: "white"
};

export default App;
