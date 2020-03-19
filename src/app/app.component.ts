import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { WebDataRocksPivot } from "./webdatarocks/webdatarocks.angular4";
import { ScriptLoaderService } from 'angular-google-charts';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit {
  @ViewChild("pivot1") child: WebDataRocksPivot;

  private type: any;

  public pivotReport = {
    dataSource: {
      filename: "https://cdn.webdatarocks.com/data/data.csv"
    },
    slice: {
      rows: [{ uniqueName: "Business Type" }],
      columns: [{ uniqueName: "Measures" }],
      measures: [{ uniqueName: "Price", aggregation: "sum" }]
    }
  };

  constructor(private loaderService: ScriptLoaderService){}

  ngOnInit() {  
    this.loaderService.onReady.subscribe(() => {
      this.loaderService.loadChartPackages(this.type).subscribe(() => {
        // Start creating your chart now
        // Example:
        // const formatter = new google.visualization.BarFormat();
        console.info('[google]', google );
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(() => this.onGoogleChartsLoaded());
      });
   });
  }

  ngAfterViewInit(){  }

  onGoogleChartsLoaded() {
    this.googleChartsLoaded = true;
    if (this.pivotTableReportComplete) {
      this.createGoogleChart();
    }
  }

  onPivotReady(pivot: WebDataRocks.Pivot): void {
    console.log("[ready] WebDataRocksPivot", this.child);
  }

  onCustomizeCell(
    cell: WebDataRocks.CellBuilder,
    data: WebDataRocks.Cell
  ): void {
    //console.log("[customizeCell] WebDataRocksPivot");
    if (data.isClassicTotalRow) cell.addClass("fm-total-classic-r");
    if (data.isGrandTotalRow) cell.addClass("fm-grand-total-r");
    if (data.isGrandTotalColumn) cell.addClass("fm-grand-total-c");
  }

  pivotTableReportComplete: boolean = false;
  googleChartsLoaded: boolean = false;

  onReportComplete(event:any): void {
    console.log('[Event]: ', event);
    this.child.webDataRocks.off("reportcomplete");
    this.pivotTableReportComplete = true;
    this.createGoogleChart();
  }

  createGoogleChart() {
    if (this.googleChartsLoaded) {
      console.info('[webdatarocks]', this.child.webDataRocks);
      this.child.webDataRocks.googlecharts.getData(
        { type: "column" },
        data => this.drawChart(data),
        data => this.drawChart(data)
      );
    }
  }

  drawChart(_data: any) {
    var data = google.visualization.arrayToDataTable(_data.data);

    var options = {
      title: "Sales by Business Types",
      legend: { position: "top" },
      colors: ["#7570b3"],
      isStacked: true
    };

    var chart = new google.visualization.ColumnChart(
      document.getElementById("googlechart-container")
    );
    
    chart.draw(data, <google.visualization.ColumnChartOptions>options);
  }
}
