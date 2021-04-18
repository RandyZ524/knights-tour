import './App.css';
import Board from './Board';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>The Knight's Tour</h1>
          <h3>Solving heuristically with Warnsdorff's rule</h3>
      </header>
        <p>
            The knight is a piece in chess with a highly unusual moving pattern. It's able to move in an L-shape; two
            squares in one direction, then another square perpendicularly.
        </p>
        <Board
            width={5} height={4}
            knight={[1, 1]}
            movable={false} tourable={true} auto={false}/>
        <p>
            One of the most ancient and well-known chess puzzles, dating back to at least the 9th century, is to find a
            path for the knight such that it visits every square on the chessboard exactly once. This is known as a
            <em> knight's tour</em>. Try finding one yourself!
        </p>
        <Board
            width={8} height={8}
            knight={[0, 0]}
            movable={true} tourable={true} auto={false}/>
        <p>
            Warnsdorff's rule for solving knight's tours relies on the concept of <em> accessibility</em>, defined as
            the number of valid moves a square has. Invalid moves are ones that would put the knight out of bounds or
            onto a square already traversed.
        </p>
        <Board
            width={5} height={5}
            knight={[2, 1]}
            movable={false} tourable={true} auto={true}
            accessDefault={true} example={true}/>
        <p>
            The algorithm is very simple: at each step, calculate the accessibility of every square that can be directly
            moved to, then choose the square with the smallest accessibility. In the case of a tie, the simplest version
            of the algorithm tiebreaks randomly.
        </p>
        <Board
            width={8} height={8}
            knight={[0, 0]}
            movable={false} tourable={true} auto={true}/>
    </div>
  );
}

export default App;
