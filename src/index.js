import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className={props.highlight} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlight={
          this.props.won && this.props.won.move.includes(i)
            ? "square highlight"
            : "square"
        }
      />
    );
  }

  render() {
    const n = 3;
    let position = -1;

    return (
      <div>
        {[...Array(n)].map((x, i) => {
          return (
            <div className="board-row" key={i}>
              {[...Array(n)].map((y, j) => {
                position++;
                return this.renderSquare(position);
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          locations: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      isDesc: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          locations: locations[i],
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  updateSort() {
    this.setState({ isDesc: !this.state.isDesc });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const draw = !current.squares.includes(null);

    const moves = history.map((step, move) => {
      const desc = move
        ? "Go to move #" + move + ` @ (${step.locations[0]}, ${step.locations[1]})`
        : "Go to game start";
      return (
        <li key={move} value={move + 1}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else if (draw) {
      status = "It's a draw!";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            won={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          
          <ol>{this.state.isDesc ? moves : moves.reverse()}</ol>

          <button onClick={() => this.updateSort()}>
            Sort {this.state.isDesc ? "Descending" : "Ascending"}
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        move: lines[i],
      };
    }
  }
  return null;
}
