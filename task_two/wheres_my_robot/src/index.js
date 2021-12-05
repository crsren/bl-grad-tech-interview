import React from "react";
import ReactDOM from "react-dom";
import "./styles/tailwind.css";

class Square extends React.Component {
  // a single square in which the robot can exist
  // A 5x5 grid of squares make up the board

  render() {
    return (
      <div className="w-28 h-28 border-2 m-1 flex justify-center items-center">
        <img
          src="wall-e.png"
          alt="robot"
          className={
            "h-20 w-20 transform duration-200 ease-in-out " + this.props.style
          }
        />
      </div>
    );
  }
}

// ADDING THE BELOW COMPONENTS WOULD MAKE THIS A BIT MORE ORGANIZED... BUT DON'T REALLY KNOW REACT YET
// class Grid extens React.Component {
// }

// class Console extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//   render() {
//     return (
//     );
//   }
// }

class Game extends React.Component {
  // The root of the application
  // Much in here could be organised into separate components (e.g. Console, Grid, ...),
  // but I don't understand react enough (yet!!) to do that in a reasonable amount of time

  constructor(props) {
    super(props);

    this.state = {
      squares: Array(25).fill("hidden"),
      pos: [null, null],
      dir: null,
      // map to translate direction into tailwind class
      dir2Tailwind: {
        NORTH: "rotate-180",
        EAST: "-rotate-90",
        SOUTH: "rotate-0",
        WEST: "rotate-90",
      },
      // message to display in console
      msg: "Start by placing your robot...",
      msgClass: "italic",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // a dictionary of different commands the robot understand
    this.commands = {
      place: (args) => {
        // check if arguments ar valid
        if (args.length !== 3) throw Error("Place: Should have 3 arguments");
        let [x, y, dir] = args;

        // format direction
        dir = dir.replace(/['"]/g, "");
        dir = dir.toUpperCase();
        if (
          isNaN(x) ||
          isNaN(y) ||
          !["NORTH", "SOUTH", "EAST", "WEST"].includes(dir)
        )
          throw Error("Place: Invalid arguments");
        else [x, y, dir] = [+x, +y, dir];

        // check if position is within bounds
        if (x < 0 || x > 4 || y < 0 || y > 4)
          throw Error(`Place: Position ${x}, ${y} out of bounds`);

        // update state
        const squares = Array(25).fill("hidden");
        squares[5 * y + x] = this.state.dir2Tailwind[dir];

        this.setState({
          squares: squares,
          pos: [x, y],
          dir: dir.toUpperCase(),
          msg: "Placed robot at " + x + "," + y + " facing " + dir,
          msgClass: "text-green-700",
        });
      },
      move: (args) => {
        // check if input is valid
        if (!this.state.dir) throw Error("Move: Robot not placed");
        if (args.length) throw Error("Move: Should have no arguments");

        let [x, y] = this.state.pos;
        let dir = this.state.dir;

        // check if position is within bounds and move accordingly
        if (dir === "NORTH" && y < 4) y++;
        else if (dir === "SOUTH" && y > 0) y--;
        else if (dir === "EAST" && x < 4) x++;
        else if (dir === "WEST" && x > 0) x--;
        else console.log("Move: Robot cannot move");

        // update state
        const squares = Array(25).fill("hidden");
        squares[5 * y + x] = this.state.dir2Tailwind[dir];

        this.setState({
          squares: squares,
          pos: [x, y],
          msg: "Moved from " + this.state.pos + " to " + [x, y],
          msgClass: "text-green-700",
        });
      },
      left: (args) => {
        // check if input is valid
        if (!this.state.dir) throw Error("Left: Robot not placed");
        if (args.length) throw Error("Left: Should have no arguments");

        let dir = this.state.dir;
        if (dir === "NORTH") dir = "WEST";
        else if (dir === "WEST") dir = "SOUTH";
        else if (dir === "SOUTH") dir = "EAST";
        else if (dir === "EAST") dir = "NORTH";

        // update state
        let [x, y] = this.state.pos;
        const squares = Array(25).fill("hidden");
        squares[5 * y + x] = this.state.dir2Tailwind[dir];

        this.setState({
          squares,
          dir,
          msg: "Turned left",
          msgClass: "text-green-700",
        });
      },
      right: (args) => {
        // check if input is valid
        if (!this.state.dir) throw Error("Right: Robot not placed");
        if (args.length) throw Error("Right: Should have no arguments");

        let dir = this.state.dir;
        if (dir === "NORTH") dir = "EAST";
        else if (dir === "EAST") dir = "SOUTH";
        else if (dir === "SOUTH") dir = "WEST";
        else if (dir === "WEST") dir = "NORTH";

        // update state
        let [x, y] = this.state.pos;
        const squares = Array(25).fill("hidden");
        squares[5 * y + x] = this.state.dir2Tailwind[dir];

        this.setState({
          squares,
          dir,
          msg: "Turned right",
          msgClass: "text-green-700",
        });
      },
      report: (args) => {
        // check if input is valid
        if (!this.state.dir) throw Error("Report: Robot not placed");
        if (args.length) throw Error("Report: Should have no arguments");

        let msg = `Robot is at position ${this.state.pos[0]}, ${this.state.pos[1]} and facing ${this.state.dir}`;
        console.log(msg);
        this.setState({ msg, msgClass: "text-green-700 font-bold" });
      },
    };
  }

  handleChange(event) {
    // automatially sync text input with state
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    // handle form submission
    event.preventDefault();
    this.processInput(this.state.value);
  }

  processInput(input) {
    // process input and execute command
    try {
      let command = input.split("(")[0];
      command = command.toLowerCase();
      if (command === input) throw new Error("Invalid command syntax");

      let args = input.split("(")[1].split(")")[0];
      if (args === "") args = [];
      else args = args.split(",").map((arg) => arg.trim());

      if (command in this.commands) {
        let fn = this.commands[command];
        // alert(`Command ${command} with arguments ${args}`);
        fn(args);
      } else {
        throw new Error(`Command ${command} not found!`);
      }
    } catch (e) {
      // alert(e.message);
      this.setState({ msg: e.message, msgClass: "text-red-600" });
      console.log(e);
    }
  }

  renderSquare(i) {
    return <Square style={this.state.squares[i]} />;
  }

  render() {
    return (
      <div className="justify-between p-8">
        <div className="text-4xl py-2">Where's my Robot?</div>
        <a className="hover:underline text-blue-700" href="https://github.com/crsren/bl-grad-tech-interview">
          Github Repository
        </a>
        <div className="place-self-center">
          <div className="flex-col py-8 ">
            <div className="flex">
              {this.renderSquare(20)}
              {this.renderSquare(21)}
              {this.renderSquare(22)}
              {this.renderSquare(23)}
              {this.renderSquare(24)}
            </div>
            <div className="flex">
              {this.renderSquare(15)}
              {this.renderSquare(16)}
              {this.renderSquare(17)}
              {this.renderSquare(18)}
              {this.renderSquare(19)}
            </div>
            <div className="flex">
              {this.renderSquare(10)}
              {this.renderSquare(11)}
              {this.renderSquare(12)}
              {this.renderSquare(13)}
              {this.renderSquare(14)}
            </div>
            <div className="flex">
              {this.renderSquare(5)}
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
              {this.renderSquare(9)}
            </div>
            <div className="flex">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
              {this.renderSquare(3)}
              {this.renderSquare(4)}
            </div>
          </div>
        </div>
        {/* Command Input (ideally a separate component) */}
        <div className="p-4 border rounded-l">
          <div className="px-2">
            <div className="text-2xl font-semibold pt-1 pb-3">
              {">"}_ Terminal
            </div>
            <form
              className="text-l font-mono font-medium"
              onSubmit={this.handleSubmit}
              autoFocus
            >
              <label>
                robo: $
                <input
                  className="py-2 pl-2 focus:outline-none"
                  type="text"
                  value={this.value}
                  onChange={this.handleChange}
                />
              </label>
              <input
                className="bg-green-700 mx-3 my-2 p-2 rounded text-mono font-semibold text-white"
                type="submit"
                value="Run"
              />
            </form>
            <div className={"font-mono py-2 " + this.state.msgClass}>
              {this.state.msg}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
