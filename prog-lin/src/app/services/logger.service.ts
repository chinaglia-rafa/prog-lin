import { Injectable } from '@angular/core';

export interface Log {
  /** Descrição do log */
  text: string;
  /**
   * Tipo de log:
   *     - [dev] desenvolvimento
   *     - [stp] passo do algoritmo
   *     - [dec] decisão sendo tomada pelo algoritmo
   *     - [err] erro no algoritmo
   */
  type: string;
  /**
   * Nível de log (níveis mais altos são mais verbosos)
   *     - 0 log básico (logs essenciais para a compreensão do algoritmo)
   *     - 1 log detalhado (logs que incrementam a compreensão do algoritmo)
   *     - 2 log minucioso (logs de desenvolvimento, debug ou coisas dessa natureza)
   */
  level: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logs: Log[] = [];

  constructor() {}

  log(str: string, type: string, level: number = 0): void {
    if (!['dev', 'stp', 'dec', 'err'].includes(type)) {
      console.log('Erro: tipo de log desconhecido');
      return;
    }
    if (level < 0 || level > 2) {
      console.log('Erro: nível de log desconhecido');
      return;
    }
    console.log('oi');

    this.logs.unshift({
      text: str,
      type: type,
      level: level,
    });
  }
}
