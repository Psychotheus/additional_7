module.exports = function solveSudoku(matrix) {
  // your solution
  let sudoku = new Sudoku(matrix);
  let solution = sudoku.solveSudoku();

  return solution;
}

class Sudoku {

  constructor(matrix) {
    this.matrix = matrix;
    this.supposed = [];
  }

  findSupposed() {
  
    for (let i = 0; i < 9; i++) {
  
      for (let j = 0; j < 9; j++) {
  
        if (this.matrix[i][j] == 0) {
          let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          
          for (let k = 0; k < 9; k++) {
            
            if (numbers.includes(this.matrix[i][k])) {
              
              numbers.splice(numbers.indexOf(this.matrix[i][k]), 1);
            }
  
            if (numbers.includes(this.matrix[k][j])) {
              
              numbers.splice(numbers.indexOf(this.matrix[k][j]), 1);
            }
  
          }
          
          let segmentI = Math.floor(i / 3) * 3;
          let segmentJ = Math.floor(j / 3) * 3;

          for (let k = segmentI; k < segmentI + 3; k++) {
  
            for (let n = segmentJ; n < segmentJ + 3; n++) {
  
              if (numbers.includes(this.matrix[k][n])) {
  
                numbers.splice(numbers.indexOf(this.matrix[k][n]), 1);
              }
            }
          }
          

          if (numbers.length == 1) {
            this.matrix[i][j] = numbers[0];
            this.supposed.length = [];
            i = 0;
            j = -1;
          } else {
            this.supposed.push({indices: [i,j], numbers: numbers});
          }
          
        }
  
      }
    }
  }

  findHiddenSingle() {
    
    while (this.supposed.length != 0) {
      if (this.lessSupposed('row')) {
        this.supposed.length = 0;
        this.findSupposed();
      } else if (this.lessSupposed('col')){
        this.supposed.length = 0;
        this.findSupposed();
      } else if (this.lessSupposed('segment')) {
        this.supposed.length = 0;
        this.findSupposed();
      } else {
        
        break;
      }
    }
  }
  
  lessSupposed(name) {

    let changed = false;
    let segments = new Array(9);
    
    for (let i = 0; i < 9; i++) {
      segments[i] = [];
    }
    
    let index = 0;

    for (let k = 0; k < this.supposed.length; k++) {
      let [i, j] = this.supposed[k].indices;
      
      switch(name) {
        case 'row': 
          index = i;
          break;
        case 'col': 
          index = j;
          break;
        case 'segment': 
          index = Math.floor(i / 3) * 3 + Math.floor(j / 3);
          break;
      }
      
      segments[index].push(this.supposed[k]);
    }

    let numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let lastIndex = new Array(10);

    for (let k = 0; k < 9; k++) {
      
      for (let n = 0; n < segments[k].length; n++) {
        
        for (let a = 0; a < segments[k][n].numbers.length; a++) {
          
          numbers[segments[k][n].numbers[a]]++;
          lastIndex[segments[k][n].numbers[a]] = [k, n];

        }

      }

      for (let a = 1; a < 10; a++) {
        if (numbers[a] == 1) {
          let [b, c] = lastIndex[a];
          let [i, j] = segments[b][c].indices;
          
          this.matrix[i][j] = a;
          changed = true;
        }
      }
      
      numbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      lastIndex = new Array(10);

    }
    
    if (!changed && name == 'segment') {
      let couple = this.findCouple(segments);

      if (couple) {
        let [i, j] = couple.indices;
        this.matrix[i][j] = couple.numbers[0];
        changed = true;
      }
    }
    
    return changed;
  }

  findCouple(segments) {
    for (let k = 0; k < 9; k++) {
      for (let n = 0; n < segments[k].length; n++) {
        let couple = segments[k][n].numbers;

        if (couple.length == 2) {
          
          for (let g = n; g < segments[k].length; g++) {
            if (couple.toString() == segments[k][g].numbers.toString()) {
              
              return segments[k][g];
            }
          }
        }
      }
    }

    return false;
  }

  solveSudoku() {
    this.findSupposed();
    
    if (this.supposed != 0) {
      this.findHiddenSingle();
    }
    
    console.log(this.matrix);
    return this.matrix;
  }

}