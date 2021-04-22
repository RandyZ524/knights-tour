import './App.css';
import Board from './Board';
import TourBoard from './TourBoard';
import AutoBoard from './AutoBoard';

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
            id={0}
            width={5} height={4} knight={[1, 1]}/>
        <p>
            One of the most ancient and well-known chess puzzles, dating back to at least the 9th century, is to find a
            path for the knight such that it visits every square on the chessboard exactly once. This is known as a
            <em> knight's tour</em>. Try finding one yourself!
        </p>
        <TourBoard
            id={1}
            width={8} height={8} knight={[0, 0]}/>
        <p>
            The algorithm is very simple: at each step, calculate the accessibility of every square that can be directly
            moved to, then choose the square with the smallest accessibility. In the case of a tie, the simplest version
            of the algorithm tiebreaks randomly.
        </p>
        <AutoBoard
            id={2}
            width={8} height={8} knight={[0, 0]}/>
    </div>
  );
}

export default App;
