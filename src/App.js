import './App.css';
import TourBoard from './TourBoard';
import AutoBoard from './AutoBoard';
import ExampleBoard from "./ExampleBoard";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>The Knight's Tour</h1>
                <h3>Solving heuristically with Warnsdorff's rule</h3>
            </header>
            <p>
                The knight is a piece in chess with a highly unusual moving pattern. It's able to move in an L-shape;
                two
                squares in one direction, then another square perpendicularly.
            </p>
            <ExampleBoard
                id={0}
                width={5} height={4}
                knight={[1, 1]} knightTo={[3, 2]}
                scrolling={true}/>
            <p>
                One of the most ancient and well-known chess puzzles, dating back to at least the 9th century, is to
                find a
                path for the knight such that it visits every square on the chessboard exactly once. This is known as a
                <em> knight's tour</em>. Try finding one yourself!
            </p>
            <TourBoard
                id={1}
                width={8} height={8} knight={[0, 0]}/>
            <p>
                Warnsdorff's rule for solving knight's tours relies on the concept of <em> accessibility</em>, defined
                as
                the number of valid moves a square has. Invalid moves are ones that would put the knight out of bounds
                or
                onto a square already traversed.
            </p>
            <ExampleBoard
                id={2}
                width={5} height={4} knight={[1, 1]}
                showAccess={true} movable={true}/>
            <p>
                The algorithm is very simple: at each step, calculate the accessibility of every square that can be
                directly
                moved to, then choose the square with the smallest accessibility. In the case of a tie, the simplest
                version
                of the algorithm tiebreaks randomly.
            </p>
            <AutoBoard
                id={3}
                width={3} height={4} knight={[0, 0]}
                defaultAccess={true}/>
            <p>
                Here's the algorithm working on the most common form of the problem, which uses a standard 8x8 square
                chessboard.
            </p>
            <AutoBoard
                id={4}
                width={8} height={8} knight={[0, 0]}/>
            <p>
                And here's a board you can change the size of. For what square board dimensions is a knight's tour
                not possible?
            </p>
            <AutoBoard
                id={5}
                width={100} height={100} knight={[0, 0]}
                dimenModifiable={true}/>
            <AutoBoard
                id={5}
                width={100} height={100} knight={[0, 0]}
                tieModifiable={true}/>
        </div>
    );
}

export default App;
