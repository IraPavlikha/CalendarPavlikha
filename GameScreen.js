import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import Sudoku from 'sudoku-umd';

const screenWidth = Dimensions.get('window').width;
const cellSize = (screenWidth - 60) / 9;
const numberButtonSize = cellSize * 0.7;

const GameScreen = ({ route, navigation }) => {
  const { difficulty } = route.params;
  const [initialPuzzle, setInitialPuzzle] = useState([]);
  const [puzzle, setPuzzle] = useState([]);
  const [solvedPuzzle, setSolvedPuzzle] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [message, setMessage] = useState('');
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    generateNewGame();
    const interval = setInterval(() => {
      if (timerRunning) {
        setTime(prevTime => prevTime + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [difficulty, timerRunning]);

  const generateNewGame = () => {
    const puzzleString = Sudoku.generate(difficulty);
    const grid = Sudoku.board_string_to_grid(puzzleString);
    setInitialPuzzle(grid);
    setPuzzle(grid.map(row => row.map(cell => cell === '.' ? 0 : parseInt(cell))));
    const solutionGrid = Sudoku.board_string_to_grid(Sudoku.solve(puzzleString))
      .map(row => row.map(cell => cell === '.' ? 0 : parseInt(cell)));
    setSolvedPuzzle(solutionGrid);
    setSelectedCell(null);
    setMessage('');
    setTime(0);
    setTimerRunning(true);
    setShowSolution(false);
  };

  const handleCellPress = (row, col) => {
    if (!showSolution && initialPuzzle[row][col] === '.') {
      setSelectedCell({ row, col });
    }
  };

  const handleNumberInput = (num) => {
    if (!showSolution && selectedCell) {
      const { row, col } = selectedCell;
      const newPuzzle = puzzle.map(r => [...r]);
      if (initialPuzzle[row][col] === '.') {
        newPuzzle[row][col] = num;
        setPuzzle(newPuzzle);
        checkCompletion(newPuzzle);
      }
    }
  };

  const checkCompletion = (currentPuzzle) => {
    if (currentPuzzle.flat().every(cell => cell !== 0)) {
      validateSolution();
    }
  };

  const validateSolution = () => {
    const isCorrect = JSON.stringify(puzzle) === JSON.stringify(solvedPuzzle);

    if (isCorrect) {
      setTimerRunning(false);
      Alert.alert(
        'Вітаємо!',
        `Ви розв'язали судоку за ${formatTime(time)}`,
        [
          { text: 'Нова гра', onPress: generateNewGame },
          { text: 'У меню', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      setMessage('Є помилки! Перевірте розв\'язок');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} хв ${secs} сек`;
  };

  const handleSolvePuzzle = () => {
    setPuzzle(solvedPuzzle.map(row => [...row]));
    setShowSolution(true);
    setTimerRunning(false);
    setMessage('Показано розв\'язок. Оберіть дію:');
  };

  const renderCell = (row, col) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;
    const isFixed = initialPuzzle[row][col] !== '.';
    const value = puzzle[row][col];
    const displayValue = value === 0 ? '' : value;
    const hasRightBorder = (col + 1) % 3 === 0 && col !== 8;
    const hasBottomBorder = (row + 1) % 3 === 0 && row !== 8;

    return (
      <TouchableOpacity
        key={`cell-${col}`}
        style={[
          styles.cell,
          isFixed && styles.fixedCell,
          isSelected && styles.selectedCell,
          showSolution && styles.solutionCell,
          hasRightBorder && styles.rightBorder,
          hasBottomBorder && styles.bottomBorder,
        ]}
        onPress={() => handleCellPress(row, col)}
        disabled={showSolution}
      >
        <Text style={[
          styles.cellText,
          isFixed && styles.fixedText,
          isSelected && styles.selectedText,
          showSolution && styles.solutionText,
        ]}>
          {displayValue}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderActionButtons = () => {
    if (showSolution) {
      return (
        <View style={styles.solutionButtons}>
          <TouchableOpacity
            style={styles.solutionButton}
            onPress={generateNewGame}
          >
            <Text style={styles.solutionButtonText}>Нова гра</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.solutionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.solutionButtonText}>У меню</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={validateSolution}>
          <Text style={styles.buttonText}>Перевірити</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSolvePuzzle}>
          <Text style={styles.buttonText}>Розв'язати</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={generateNewGame}>
          <Text style={styles.buttonText}>Нова гра</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Назад</Text>
      </TouchableOpacity>

      <Text style={styles.difficultyText}>
        {difficulty === 'easy' ? 'Легкий рівень' :
         difficulty === 'medium' ? 'Середній рівень' : 'Складний рівень'}
      </Text>

      <Text style={styles.timerText}>Час: {formatTime(time)}</Text>

      <View style={styles.board}>
        {puzzle.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </View>
        ))}
      </View>

      {!showSolution && (
        <View style={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => handleNumberInput(num)}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.numberButton, styles.clearButton]}
            onPress={() => handleNumberInput(0)}
          >
            <Text style={styles.numberText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {renderActionButtons()}

      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F9FC',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#5D8BF4',
  },
  difficultyText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#5D8BF4',
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 16,
    color: '#5D8BF4',
    marginBottom: 15,
  },
  board: {
    borderWidth: 2,
    borderColor: '#A7C7E7',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row'
  },
  cell: {
    width: cellSize,
    height: cellSize,
    borderWidth: 0.5,
    borderColor: '#D1E3F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  fixedCell: {
    backgroundColor: '#E1F0FF',
  },
  solutionCell: {
    backgroundColor: '#E8F5E9',
  },
  fixedText: {
    color: '#4A6FA5',
    fontWeight: 'bold',
  },
  selectedCell: {
    backgroundColor: '#D4E6FF',
  },
  selectedText: {
    color: '#2C5BB4',
    fontWeight: 'bold',
  },
  solutionText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  rightBorder: {
    borderRightWidth: 1.5,
    borderRightColor: '#A7C7E7',
  },
  bottomBorder: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#A7C7E7',
  },
  cellText: {
    fontSize: cellSize * 0.5,
  },
  numberPad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    width: cellSize * 5,
  },
  numberButton: {
    width: numberButtonSize,
    height: numberButtonSize,
    margin: 5,
    backgroundColor: '#A7C7E7',
    borderRadius: numberButtonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: '#FFA07A',
  },
  numberText: {
    fontSize: numberButtonSize * 0.5,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  solutionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 20,
    gap: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#E1F0FF',
    borderRadius: 20,
  },
  solutionButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: '#5D8BF4',
    borderRadius: 25,
  },
  buttonText: {
    color: '#5D8BF4',
    fontSize: 14,
    fontWeight: '500',
  },
  solutionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#5D8BF4',
  },
});

export default GameScreen;