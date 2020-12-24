
export class Employee{
    public UserID: number;
    public Name: string;
    public Designation: string;
    public Skills!: string;
    public DOB: Date;
    public SkillSet: Array<string>;

    constructor(UserID:number,Name:string,Designation:string,Skills:string,DOB:Date){
        this.UserID = UserID;
        this.Name = Name;
        this.Designation = Designation;
        this.SkillSet = Skills.split(',');
        this.DOB = DOB;
    }
}