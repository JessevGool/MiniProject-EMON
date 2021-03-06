import { Component, OnInit } from '@angular/core';
import { ApicommsService } from '../apicomms.service';
import { Datagram } from '../entities/Datagram';
import { Temprature } from '../entities/Temprature';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.css']
})

export class AdditionalInfoComponent implements OnInit {

  
  thresholdConfig = {
    '0': {color: 'green'},
    '2.5': {color: 'orange'},
    '4': {color: 'red'}
};

  tempratureConfig = {
    '0': {color : 'blue'},
    '15': {color: 'green'},
    '20': {color: 'orange'},
    '30': {color: 'red'}
  };
  constructor(private api: ApicommsService) { }
  datagram: Datagram;
  temprature: Temprature;
 
  canvasSize = "250";

  gaugeType = "arch";
  gaugeValue = 0;
  gaugeLabel = "Power Usage";
  gaugeAppendText = "kWh";

  gaugeType1 = "arch";
  gaugeValue1 = 0;
  gaugeLabel1 = " Total Gas Used";
  gaugeAppendText1 = "m*3";

  gaugeType2 = "arch";
  gaugeValue2= 0;
  gaugeLabel2 = "Total Usage";
  gaugeAppendText2 = "kWh";

  gaugeType3 = "arch";
  gaugeValue3= 0;
  gaugeLabel3 = "High return";
  gaugeAppendText3 = "kWh";

  gaugeType4 = "arch";
  gaugeValue4 = 0;
  gaugeLabel4 = "Price per hour";
  gaugeAppendText4 = "Euro";

  gaugeType5 = "arch";
  gaugeValue5 = 0;
  gaugeLabel5 = "Degrees in Celcius";
  gaugeAppendText5 = "C";

  gaugeType6 = "arch";
  gaugeValue6 = 0;
  gaugeLabel6 = "Average in Celcius";
  gaugeAppendText6 = "C";

  ngOnInit(): void {
     this.getDatagrams();
     this.getTempratures();
     this.getAverageToday();
     setInterval(() => { 
       this.getDatagrams();
       this.getTempratures();
       }, 20000);
  }

  getDatagrams() {
    console.log("received data");
    this.api.getSingleDatagram().subscribe(datagram => {
      this.datagram = datagram;
      this.gaugeValue = datagram.currentUsage;
      this.gaugeValue1 = Math.ceil(datagram.gasUsage);
      this.gaugeValue2 = Math.ceil(datagram.totalHigh);
      this.gaugeValue3 = datagram.returnHigh;
      let price: string = ((datagram.currentUsage/1) * 0.20).toFixed(2)
      this.gaugeValue4 = +price;
    });
  }

  getTempratures() {
    console.log("received temprature data");
    this.api.getSingleTemprature().subscribe(temprature => {
      this.temprature = temprature;
      this.gaugeValue5 = Number(temprature.value);
    })
  }
  
  getAverageToday(){
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec"
  ];
    let dateTime = new Date();
    let formattedDate = `${monthNames[dateTime.getMonth()]}_${dateTime.getDate()}`
    this.api.getAverageByDate(formattedDate).subscribe(temprature =>{
      this.gaugeValue6 = temprature;
    })
  }

}
