import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={"square" + (props.hasWon ? " square--winning" : "")} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function renderSquare(i,props) {
  return (
    <Square
      hasWon={props.winningSquares.includes(i)}
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  );
}

function Board(props) {
  const outputBoard = Array(9).fill(null);

  for(let i = 0; i < 9; i+=3) {
    outputBoard.push(<div className="board-row">
    {renderSquare(i,props)}{renderSquare(i+1,props)}{renderSquare(i+2,props)}
    </div>);
  }

  return <div>{outputBoard}</div>;
}

// class Board extends React.Component {
//   renderSquare(i) {
//     return (
//       <Square
//         hasWon={this.props.winningSquares.includes(i)}
//         value={this.props.squares[i]}
//         onClick={() => this.props.onClick(i)}
//       />
//     );
//   }

//   render() {
//     const arr = Array(9).fill(null).map((elem,move) => this.renderSquare(move));
//     let newArr = [];
//     for (let i = 0; i < 9; i+=3) {
//         newArr.push(<div className="board-row">{arr[i]}{arr[i+1]}{arr[i+2]}</div>);
//     }
//     return (<div>{newArr}</div>);
//   }
// }
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveLocation: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares).winningLetter || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        moveLocation: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
      });
  }

  swapOrder() {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      const boldText = (move === this.state.stepNumber) ? <b>{desc}</b> : desc;
      const moveLoc = move ? 
        `Move: (${history[move].moveLocation % 3 + 1},${Math.floor(history[move].moveLocation / 3)+1})` : 
        '';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{boldText}</button>
          <div>{moveLoc}</div>
        </li>
      );
    });

    let status;
    if (winner.winningLetter) {
      status = 'Winner: ' + winner.winningLetter;
    } else if (!current.squares.some(elem => elem === null)) {
      status = "Draw";
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    let toggleOrderButton = this.state.ascendingOrder ? 'Toggle Descending list' : 'Toggle Ascending List';
    let movesList = (this.state.ascendingOrder) ? moves : moves.slice().reverse(); 
    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningSquares={calculateWinner(current.squares).winningSquares}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            gameDone={winner.winningLetter}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.swapOrder()}>{toggleOrderButton}</button>
          <ol>{movesList}</ol>
        </div>
      </div>
    );
  }
}
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
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
          winningLetter: squares[a],
          winningSquares: lines[i],
        };
      }
    }
    return {
      winningLetter: null,
      winningSquares: [],
    };
  }