export interface Value {
    requestId: number;
    domainId: number;
    projectSid: number;
    problemCode: string;
    details: string;
    reqCategory: string;
    description: string;
    priority: string;
    sRX: number;
    sRY: number;
    problemSid: number;
    reqCustFieldCatId: number;
    probAddress: string;
    probCity: string;
    probZip: string;
    probAddType: string;
    initiatedBy: string;
    dateTimeInit: string;
    submitToPager: string;
    submitToPhone: string;
    submitTo: string;
    submitToEmail: string;
    closedBy: string;
    dateTimeClosed: string;
    workOrderId: string;
    projectName: string;
    DatesubmitTo: string;
    submitToOpenBy: string;
    dateSubmitToOpen: string;
    dispatchTo: string;
    DatedispatchTo: string;
    dispatchOpenBy: string;
    dateDispatchOpen: string;
    mapPage: string;
    shop: string;
    status: string;
    cancel: boolean;
    cancelledBy: string;
    dateCancelled: string;
    laborCost: number;
    fieldInvtDone: boolean;
    dateInvtDone: string;
    wONeeded: boolean;
    excursion: boolean;
    tileNo: string;
    prjCompleteDate: string;
    otherSystemId: string;
    OtherSystemstatus: string;
    otherSystemCode: string;
    otherSystemDesc: string;
    otherSystemDesc2: string;
    probAptNum: string;
    probLandmark: string;
    probDistrict: string;
    probState: string;
    probLocation: string;
    cancelReason: string;
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    text5: string;
    text6: string;
    text7: string;
    text8: string;
    text9: string;
    text10: string;
    text11: string;
    text12: string;
    text13: string;
    text14: string;
    text15: string;
    text16: string;
    text17: string;
    text18: string;
    text19: string;
    text20: string;
    num1: number;
    num2: number;
    num3: number;
    num4: number;
    num5: number;
    date1: string;
    date2: string;
    date3: string;
    date4: string;
    date5: string;
    initiatedByApp: string;
    resolution: string;
    streetName: string;
    lockedByDesktopUser: string;
    effort: number;
    initiatedBySid: number;
    submitToSid: number;
    submitToOpenBySid: number;
    cancelledBySid: number;
    closedBySid: number;
    dispatchToSid: number;
    dispatchOpenBySid: number;
    isClosed: boolean;
}

export interface CityworksSrResponse {
    value: Value;
    status: number;
    message?: any; F
    errorMessages: any[];
    warningMessages: any[];
    successMessages: any[];
}