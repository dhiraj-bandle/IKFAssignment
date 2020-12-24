import { CompileShallowModuleMetadata, sharedStylesheetJitUrl, templateSourceUrl } from "@angular/compiler";
import { Component } from "@angular/core";
import { map } from "rxjs/operators";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { Employee } from './Employee.model';
import { FormBuilder,FormControl,FormGroup, NgForm} from "@angular/forms";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import { threadId } from "worker_threads";
@Component({
    selector:'app-employee',
    templateUrl:'./Employee.component.html',
    styleUrls:['./Employee.component.css']
})
export class EmployeeComponent{
    employees: Array<Employee> = [];
    EmpArray = [];
    EditMode = false;
    AddNew = false;
    UserEdit!: number;
    //NewUserForm:FormGroup;
    constructor(private formBuilder:FormBuilder, private http:HttpClient){

    }
    ngOnInit(){
        this.FetchData();
    }
     
    FetchData(){
        this.http.get(
            "http://localhost:52532/api/employees"
        )
        .subscribe(responseData=>{
            for(var emp in responseData){
                let emp1 : Employee = new Employee(
                    responseData[emp].UserID,responseData[emp].Name,responseData[emp].Designation,
                    responseData[emp].Skills,responseData[emp].DOB); 
                this.employees.push(emp1);
            }
        })
    }
    onAddNewClick(form:NgForm){
        this.EditMode=false;
        form.controls.Name.setValue('');
        form.controls.Designation.setValue('');
        form.controls.DateOfBirth.setValue('');
        form.controls.Skills.setValue('');
    }
    onEditClick(e, i,form:NgForm){
        EditIndex:Number=i;
        const value = form.value;
        this.UserEdit = this.employees[i].UserID;
        //value.set('Name').value = this.employees[i].Name;
        form.controls.Name.setValue(this.employees[i].Name);
        form.controls.Designation.setValue(this.employees[i].Designation);
        form.controls.DateOfBirth.setValue(this.employees[i].DOB);
        form.controls.Skills.setValue(this.employees[i].SkillSet.concat(','));
        this.EditMode=true;
    }
    onDeleteClick(e,i,form:NgForm){
        EditIndex:Number=i;
        const headers = new HttpHeaders();
        const DeleteUrl = "http://localhost:52532/api/Employees/"+this.employees[i].UserID;
        headers.set("Access-Control-Allow-Origin","*");
        headers.set('content-type','text/json');
        headers.set("Access-Control-Allow-Header","accept,content-type");
        headers.set("Access-Control-Allow-Methods","delete");
        this.http.delete(
            DeleteUrl,
            {headers:headers}

        ).subscribe(responseData=>{
            console.log(responseData)
        })
    }
    onSaveClick(form:NgForm){
        const value = form.value;
        let Emp:Employee;
        
        const headers = new HttpHeaders();
        headers.set("Access-Control-Allow-Origin","*");
        headers.set('content-type','text/json');
        headers.set("Access-Control-Allow-Header","accept,content-type");
        headers.set("Access-Control-Allow-Method","OPTIONS, GET, POST, PUT, DELETE");
        if(this.EditMode){
            Emp=new Employee(this.UserEdit,value.Name,value.Designation,value.Skills+',',value.DateOfBirth);
            Emp.Skills = value.Skills;
            this.http.put<Employee>(
                "http://localhost:52532/api/employees/"+this.UserEdit,
                Emp,
                {headers:headers}
            ).subscribe(responseData=>{
                console.log(responseData)
            })
        }
        else{
            Emp=new Employee(value.EditUserID,value.Name,value.Designation,value.Skills,value.DateOfBirth);
            Emp.Skills = value.Skills;
            this.http.post<Employee>(
                "http://localhost:52532/api/employees",
                Emp,
                {headers:headers}
            ).subscribe(responseData=>{
                console.log(responseData)
            })
            this.EditMode=false;
            this.employees.push(Emp);
        }  
    }

}