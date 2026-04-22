
interface Config{

    x : number;
    y : number;
    fontFamily : string;
    fontSize : string;
    color : string;
}

export class CreateCertificatesDto{

    particpantName! : string;
    templateName! : string;
    config! : Config
    
}