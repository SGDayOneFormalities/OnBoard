export class Experience{
    yearofExp: string;
    companyName: string;
    joining: string;
    leaving: string;
    worklocation: string;
    desig: string;
    domain: string;
    leavingReason: string;
    mName: string;
    mDesignation: string;
    mContact: string;
    mEmail: string;
    isEdit: boolean= false;;
    constructor(yearofExp, companyName,joining, leaving, worklocation, desig, domain, leavingReason, mName, mDesignation, mContact, mEmail, isedit){
        this.yearofExp = yearofExp;
        this.companyName = companyName;
        this.joining = joining;
        this.leaving = leaving;
        this.worklocation = worklocation;
        this.desig = desig;
        this.domain = domain;
        this.leavingReason = leavingReason;        
        this.mName = mName;
        this.mDesignation = mDesignation;
        this.mContact = mContact;
        this.mEmail = mEmail;
        this.isEdit= isedit;

    }
}