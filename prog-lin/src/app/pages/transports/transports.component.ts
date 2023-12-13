import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { TransportsService } from 'src/app/services/transports.service';

@Component({
  selector: 'app-transports',
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss'],
})
export class TransportsComponent implements OnInit {
  identifyCells = false;

  constructor(
    public transportsService: TransportsService,
    public logger: LoggerService
  ) {}

  ngOnInit(): void {}

  changeGrid(row: number, col: number, event: Event): void {
    this.transportsService.grid[row][col] = parseFloat(
      (event.target as HTMLInputElement).value
    );
    this.logger.log(
      `Fazendo valor de <span class="emp">x[${row + 1}][${
        col + 1
      }] = ${parseFloat((event.target as HTMLInputElement).value)}</span>`,
      'dev',
      2
    );
  }

  changeNeeded(col: number, event: Event): void {
    this.transportsService.needed[col] = parseFloat(
      (event.target as HTMLInputElement).value
    );
    this.logger.log(
      `Fazendo valor de <span class="emp">Necessidade[${
        this.transportsService.labelsDestinies[col]
      }] = ${parseFloat((event.target as HTMLInputElement).value)}</span>`,
      'dev',
      2
    );
  }

  changeAvaliable(col: number, event: Event): void {
    this.transportsService.avaliable[col] = parseFloat(
      (event.target as HTMLInputElement).value
    );
    this.logger.log(
      `Fazendo valor de <span class="emp">Disp[${
        this.transportsService.labelsSources[col]
      }] = ${parseFloat((event.target as HTMLInputElement).value)}</span>`,
      'dev',
      2
    );
  }

  go(): void {
    this.transportsService.start();
  }
}
