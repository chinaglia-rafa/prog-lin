import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.scss'],
})
export class LoggerComponent implements OnInit {
  level = 0;

  constructor(public loggerService: LoggerService) {}

  ngOnInit(): void {
    this.loggerService.log(`Olá, usuário!`, 'dev');
    this.loggerService.log(
      `Antes de dar início à execução do algoritmo, ajuste os valores de custos entre destinos, bem como as necessidades de cada cidade.`,
      'dev'
    );
  }
}
