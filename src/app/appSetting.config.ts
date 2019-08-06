export class AppSettings {
    public static POST_LOGINDATA = 'http://10.2.108.65:4000/api/validateLogin';
    public static POST_EMP_DATA = 'http://10.2.108.65:4000/api/onboards';
    public static PUT_EMP_DATA = 'http://10.2.108.65:4000/api/onboards';
    public static GET_EMP_DATA = 'http://10.2.108.65:4000/api/allonboard';
    public static GET_SELECTED_EMP_DATA= 'http://10.2.108.65:4000/api/onboarded';
    // public static GET_HR_EMP_DATA = 'http://10.2.108.65:4000/api/allcandidate';
    // public static POST_HR_EMP_DATA = 'http://10.2.108.65:4000/api/candidate';
    public static GET_DATA_BYDOJ = 'http://10.2.108.65:4000/api/getByCandidateDoJ';
    public static DELETE_DATA = 'http://10.2.108.65:4000/api/deleteOnboards';
    public static ADVANCE_SEARCH = 'http://10.2.108.65:4000/api/advancedSearch';
    public static LOGIN_EMP = 'http://10.2.108.65:4000/api/getDataByLogin';
    public static HRDATA_BYLOC='http://10.2.108.65:4000/api/getMapDataByLoc';
    public static SEARCH_BYSATUS='http://10.2.108.65:4000/api/getDataByStatus';
    public static PDF_DOWNLOAD ='http://10.2.108.65:3000/pdfDown';
    //'/pdftest';
    // public static DOCUMENT_UPLOAD =  'http://10.2.108.65:2020/upload'; 
    public static PDF_GENERATION = 'http://10.2.108.65:3000/pdfsync1'
    // 'http://10.2.108.65:3000/pdf';
    public static POST_DEL_UPLOAD = 'http://10.2.108.65:3030/deleteFile';
    public static GET_ZIPFOLDER = "http://10.2.108.65:3000/zippie";
    public static UPLOADCERTIFICATE_URL =  'http://10.2.108.65:3030/api';
    public static GET_UPLOADDATA = 'http://10.2.108.65:3000/readFiles';
    public static POST_SMTP='http://10.2.108.65:8080/mailTrigger';
    public static POST_STMP_HR = 'http://10.2.108.65:8000/mailHRTrigr';
    public static POST_RESEND_MAIL = 'http://10.2.108.65:8000/mailRevert';
    public static GET_STATES = 'http://10.2.108.65:4000/api/states';
    // 'http://10.2.108.65:3000/pdftest';
    // 'http://10.2.108.65:3000/pdf';
    // 'http://10.2.108.65:3000/pdfDownload';
}