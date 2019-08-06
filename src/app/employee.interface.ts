export class Employee {
    degree: string;
    subject: string;
    address: string;
    result: string;
    fromYear: number; 
    gradYear: number;
    descr: string;
    isEdit: boolean = false;
    constructor(degree ,subject , address , result , fromYear , gradYear, isedit){
        this.degree = degree;
        this.subject = subject;
        this.address = address;
        this.result = result;
        this.fromYear = fromYear;
        this.gradYear = gradYear;
        this.isEdit = isedit;
        this.descr = this.subject+ ' '+ this.address  +this.result + ' ' + this.fromYear + ' ' + this.gradYear;
    }
}