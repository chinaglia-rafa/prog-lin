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
    this.loggerService.log(`Bom dia.`, 'dev');
    this.loggerService.log(`Como estamos nesse dia?`, 'dev');
    this.loggerService.log(`Seu nível atual de logs é [${this.level}]`, 'dev');
  }
}
