import { Injectable } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class TransportsService {
  grid: number[][] = [
    [2, 3, 11, 7, 4],
    [1, 10, 6, 1, 12],
    [5, 8, 15, 9, 6],
  ];

  gridBackup: number[][] = [];

  avaliable: number[] = [23, 76, 66];
  needed: number[] = [11, 22, 33, 44, 55];

  coefZ: number[] = [];

  avaliableBackup: number[] = [];
  neededBackup: number[] = [];

  labelsSources: string[] = ['Marília', 'Rio Preto', 'São Paulo'];
  labelsDestinies: string[] = [
    'Araraquara',
    'Assis',
    'Franca',
    'Prudente',
    'Sorocaba',
  ];

  finishedSources = new Set<number>();
  finishedDestinies = new Set<number>();

  /** Determina se o algoritmo será executado pausadamente ou todo de uma vez. */
  withTimer = false;

  active = false;

  constructor(private logger: LoggerService) {}

  /**
   * Inicia o algoritmo de transportes
   */
  start(): void {
    if (!this.validate()) return;

    this.avaliableBackup = [...this.avaliable];
    this.neededBackup = [...this.needed];
    for (const line of this.grid) {
      this.gridBackup.push([...line]);
    }

    if (this.active) {
      this.passoVogel();
      return;
    }

    this.active = true;

    // this.logger.clear();

    if (this.withTimer)
      this.logger.log(
        'Iniciando o algoritmo <span class="emp">no modo didático</span>.',
        'stp',
        0
      );
    else this.logger.log('Iniciando o algoritmo.', 'stp', 0);

    /**
     * Primeiro passo: Encontrar uma solução inicial boa usando
     * Método de Aproximação de Vogel
     */
    this.logger.log(
      'Procurando uma boa solução inicial com <span class="emp">Método de Aproximação de Vogel.</span>',
      'stp',
      0
    );
    this.passoVogel();
  }

  passoVogel(): void {
    this.logger.log(
      'Verificando as diferenças entre os dois menores elementos de cada <span class="emp">linha</span>',
      'stp',
      1
    );
    /** Índice da linha com a maior diferença calculada */
    let selectedRow = -1;
    /** Valor da linha com a maior diferença calculada */
    let selectedRowValue = 0;
    /** índice da célula da linha com o menor valor */
    let selectedRowCell = 0;
    for (let i = 0; i < this.grid.length; i++) {
      // Ignora linhas que já foram finalizadas
      if (this.finishedSources.has(i)) continue;

      let menor = 9999999999; // hax hax hax
      let menorAnterior = 9999999999; // hax hax hax
      // Posições ij dos elementos menores
      let menorIJ = [-1, -1];
      let menorAnteriorIJ = [-1, -1];

      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === 0) continue;
        if (this.grid[i][j] <= menor) {
          menorAnteriorIJ = menorIJ;
          menorIJ = [i, j];
          menorAnterior = menor;
          menor = this.grid[i][j];
        } else if (this.grid[i][j] <= menorAnterior) {
          menorAnteriorIJ = [i, j];
          menorAnterior = this.grid[i][j];
        }
      }
      if (Math.abs(menorAnterior - menor) > selectedRowValue) {
        selectedRowValue = Math.abs(menorAnterior - menor);
        selectedRow = i;
        selectedRowCell = menorIJ[1];
      }

      this.logger.log(
        `${
          this.labelsSources[i]
        }: <span class="emp">|${menorAnterior} (x<span class="sub">${
          menorAnteriorIJ[0] + 1
        }${menorAnteriorIJ[1] + 1}</span>) - ${menor} (x<span class="sub">${
          menorIJ[0] + 1
        }${menorIJ[1] + 1} </span>)| = ${Math.abs(
          menorAnterior - menor
        )}</span> `,
        'stp',
        2
      );
    }
    this.logger.log(
      `${this.labelsSources[selectedRow]} será testada por ter a maior diferença entre linhas (${selectedRowValue}).`,
      'dec',
      2
    );

    this.logger.log(
      'Verificando as diferenças entre os dois menores elementos de cada <span class="emp">coluna</span>',
      'stp',
      1
    );

    /** Índice da coluna com a maior diferença calculada */
    let selectedCol = -1;
    /** Valor da coluna com a maior diferença calculada */
    let selectedColValue = 0;
    /** índice da célula da coluna com o menor valor */
    let selectedColCell = 0;
    for (let j = 0; j < this.grid[0].length; j++) {
      // Ignora colunas que já foram finalizadas
      if (this.finishedDestinies.has(j)) continue;

      let menor = 9999999999; // hax hax hax
      let menorAnterior = 9999999999; // hax hax hax
      // Posições ij dos elementos menores
      let menorIJ = [-1, -1];
      let menorAnteriorIJ = [-1, -1];

      for (let i = 0; i < this.grid.length; i++) {
        if (this.grid[i][j] === 0) continue;
        if (this.grid[i][j] <= menor) {
          menorAnteriorIJ = menorIJ;
          menorIJ = [i, j];
          menorAnterior = menor;
          menor = this.grid[i][j];
        } else if (this.grid[i][j] <= menorAnterior) {
          menorAnteriorIJ = [i, j];
          menorAnterior = this.grid[i][j];
        }
      }
      if (Math.abs(menorAnterior - menor) > selectedColValue) {
        selectedColValue = Math.abs(menorAnterior - menor);
        selectedCol = j;
        selectedColCell = menorIJ[0];
      }

      this.logger.log(
        `${
          this.labelsDestinies[j]
        }: <span class="emp">|${menorAnterior} (x<span class="sub">${
          menorAnteriorIJ[0] + 1
        }${menorAnteriorIJ[1] + 1}</span>) - ${menor} (x<span class="sub">${
          menorIJ[0] + 1
        }${menorIJ[1] + 1} </span>)| = ${Math.abs(
          menorAnterior - menor
        )}</span> `,
        'stp',
        2
      );
    }
    this.logger.log(
      `${this.labelsDestinies[selectedCol]} será testada por ter a maior diferença entre colunas (${selectedColValue}).`,
      'dec',
      2
    );
    /** Identifica se uma linha ou coluna foi finalizada (de forma a não finalizar duas ao mesmo tempo) */
    let hasFinished = false;
    if (selectedRowValue > selectedColValue) {
      const lowerLimit = Math.min(
        this.avaliable[selectedRow],
        this.needed[selectedRowCell]
      );
      this.logger.log(
        `${this.labelsSources[selectedRow]} é a linha com maior diferença (${selectedRowValue}).`,
        'dec',
        1
      );
      this.needed[selectedRowCell] -= lowerLimit;
      this.logger.log(
        `Remove ${lowerLimit} da necessidade de ${this.labelsDestinies[selectedRowCell]} (${this.needed[selectedRowCell]}).`,
        'stp',
        2
      );

      if (this.needed[selectedRowCell] === 0) {
        hasFinished = true;
        this.finishedDestinies.add(selectedRowCell);

        // Limpa cada célula da coluna finalizada
        for (let i = 0; i < this.grid.length; i++)
          if (i !== selectedRow && !this.finishedSources.has(i))
            this.grid[i][selectedRowCell] = 0;

        this.logger.log(
          `Coluna ${this.labelsDestinies[selectedRowCell]} foi finalizada.`,
          'dec',
          2
        );
      }

      this.avaliable[selectedRow] -= lowerLimit;
      this.logger.log(
        `Remove ${lowerLimit} da disponibilidade de ${this.labelsSources[selectedRow]} (${this.avaliable[selectedRow]}).`,
        'stp',
        2
      );

      if (!hasFinished && this.avaliable[selectedRow] === 0) {
        hasFinished = true;
        this.finishedSources.add(selectedRow);

        // Limpa cada célula da linha finalizada
        for (let j = 0; j < this.grid[selectedRow].length; j++)
          if (j !== selectedRowCell && !this.finishedDestinies.has(j))
            this.grid[selectedRow][j] = 0;

        this.logger.log(
          `Linha ${this.labelsSources[selectedRow]} foi finalizada.`,
          'dec',
          2
        );
      }

      this.grid[selectedRow][selectedRowCell] = lowerLimit;
      this.logger.log(
        `Faz <span class="emp">x<span class="sub">${selectedRow + 1}${
          selectedRowCell + 1
        }</span> = ${lowerLimit}</span>`,
        'stp',
        2
      );
    } else {
      const lowerLimit = Math.min(
        this.avaliable[selectedColCell],
        this.needed[selectedCol]
      );
      this.logger.log(
        `${this.labelsDestinies[selectedCol]} é a coluna com maior diferença (${selectedColValue}).`,
        'dec',
        1
      );
      this.needed[selectedCol] -= lowerLimit;
      this.logger.log(
        `Remove ${lowerLimit} da necessidade de ${this.labelsDestinies[selectedCol]} (${this.needed[selectedCol]}).`,
        'stp',
        2
      );
      if (this.needed[selectedCol] === 0) {
        hasFinished = true;
        this.finishedDestinies.add(selectedCol);

        // Limpa cada célula da coluna finalizada
        for (let i = 0; i < this.grid.length; i++)
          if (i !== selectedColCell && !this.finishedSources.has(i))
            this.grid[i][selectedCol] = 0;

        this.logger.log(
          `Coluna ${this.labelsDestinies[selectedCol]} foi finalizada.`,
          'dec',
          2
        );
      }

      this.avaliable[selectedColCell] -= lowerLimit;
      this.logger.log(
        `Remove ${lowerLimit} da disponibilidade de ${this.labelsSources[selectedColCell]} (${this.avaliable[selectedColCell]}).`,
        'stp',
        2
      );
      if (!hasFinished && this.avaliable[selectedColCell] === 0) {
        hasFinished = true;
        this.finishedSources.add(selectedColCell);

        // Limpa cada célula da linha finalizada
        for (let j = 0; j < this.grid[selectedColCell].length; j++)
          if (j !== selectedCol && !this.finishedDestinies.has(j))
            this.grid[selectedColCell][j] = 0;

        this.logger.log(
          `Linha ${this.labelsSources[selectedColCell]} foi finalizada.`,
          'dec',
          2
        );
      }

      this.grid[selectedColCell][selectedCol] = lowerLimit;
      this.logger.log(
        `Faz <span class="emp">x<span class="sub">${selectedColCell + 1}${
          selectedCol + 1
        }</span> = ${lowerLimit}</span>`,
        'stp',
        2
      );
    }

    if (this.withTimer) {
      if (!this.checkVogel()) setTimeout(() => this.passoVogel(), 1000);
    } else {
      if (!this.checkVogel()) this.passoVogel();
    }

    if (!this.checkVogel()) return;

    this.logger.log(
      `O <span class="emp">Método de Aproximação de Vogel</span> encontrou uma solução básica boa.`,
      'stp',
      0
    );

    this.logger.log(`Vamos agora otimizar a solução.`, 'stp', 1);
    this.logger.log(
      `Para isso, vamos retomar as necessidades e disponibilidades para visualização.`,
      'stp',
      2
    );

    this.avaliable = this.avaliableBackup;
    this.needed = this.neededBackup;

    if (this.withTimer) {
      setTimeout(() => {
        this.finishedSources = new Set();
        this.finishedDestinies = new Set();
        this.passoTransportes();
      }, 1000);
    } else {
      this.finishedSources = new Set();
      this.finishedDestinies = new Set();
      this.passoTransportes();
    }
  }

  /**
   * Passo do algoritmo dos transportes que irá encontrar uma solução ótima
   */
  passoTransportes(): void {
    //
  }

  /**
   * Verifica se o Método de Aproximação de Vogel chegou a uma solução bśsica
   */
  checkVogel(): boolean {
    const a = this.avaliable.filter((el) => el !== 0);
    const n = this.needed.filter((el) => el !== 0);

    return a.length === 0 && n.length === 0;
  }

  validate(): boolean {
    let isValid = true;
    let sumAvaliable = 0;
    let sumNeeded = 0;

    for (let i = 0; i < this.grid.length; i++) {
      sumAvaliable += this.avaliable[i];
      for (let j = 0; j < this.grid[i].length; j++) {
        if (i == 0) sumNeeded += this.needed[j];
        if (this.grid[i][j] < 0) {
          this.logger.log(
            `Erro: valor de <span class="emp">x[${i + 1}][${j + 1}] = ${
              this.grid[i][j]
            }</span> não pode ser menor que zero.`,
            'err',
            0
          );
          return false;
        }
      }
    }

    console.log(sumAvaliable, sumNeeded);

    if (sumAvaliable < sumNeeded) {
      this.logger.log(
        `Erro: o problema é inválido, pois <strong>não há jornais suficientes</strong> para o total necessário.`,
        'err',
        0
      );
      return false;
    } else if (sumAvaliable > sumNeeded) {
      this.logger.log(
        `Erro: há excedente de jornais disponíveis. A funcionalidade de destino artificial <strong>não foi implementada</strong>. Ajuste as disponibilidades para que seu total seja igual aos totais necessários.`,
        'err',
        0
      );
      return false;
    }

    if (isValid && !this.active)
      this.logger.log(`Problema validado com sucesso.`, 'dev', 1);
    return isValid;
  }
}
