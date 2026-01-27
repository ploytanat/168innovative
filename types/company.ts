export interface CompanyContact{
    name: string;
    phone:string;
}

export interface CompanyEmail{
    email:string;
}

export interface CompanySocial {
    label:string;
    url:string;
}

export interface Company {
    name:string;
    contact:CompanyContact;
    email:CompanyEmail;
    social:CompanySocial[];
}