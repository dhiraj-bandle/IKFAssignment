using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using System.Web.Http.Description;
using System.Web.Mvc;
using IKF_WebAPI_Assignment.Models;

namespace IKF_WebAPI_Assignment.Controllers
{
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*", exposedHeaders: "*")]
    public class EmployeesController : ApiController
    {
        private IKFEntities db = new IKFEntities();

        // GET: api/Employees
        [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*", exposedHeaders: "*")]
        public IQueryable<Employee> GetEmployees()
        {
            return db.Employees;
        }

        // GET: api/Employees/5
        [ResponseType(typeof(Employee))]
        public IHttpActionResult GetEmployee(int UserID)
        {
            var ID = new KeyValuePair<string, int>("UserID", UserID);

            Employee employee = db.Employees.Find(UserID);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        // PUT: api/Employees/5
        [System.Web.Http.HttpPut]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutEmployee(int UserID, Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (UserID != employee.UserID)
            {
                return BadRequest();
            }

            db.Entry(employee).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExists(UserID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Employees
        [ResponseType(typeof(Employee))]
        public IHttpActionResult PostEmployee(Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            //Employee emp = db.Employees.Last();
            //int PrevID = Convert.ToInt32(db.Database.ExecuteSqlCommand(@"select top(1) UserID from Employees order by UserID desc"));
            //PrevID++;
            //employee.UserID = PrevID;
            db.Employees.Add(employee);
           
            try
            {
                //db.Database.ExecuteSqlCommand(@"SET IDENTITY_INSERT [dbo].[Employee] ON");
                db.SaveChanges();
                //db.Database.ExecuteSqlCommand(@"SET IDENTITY_INSERT [dbo].[Employee] OFF");
            }
            catch (Exception ex)
            {
                if (EmployeeExists(employee.UserID))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
                Console.WriteLine(ex.Message);
            }

            return CreatedAtRoute("DefaultApi", new { id = employee.UserID }, employee);
        }

        // DELETE: api/Employees/5
        [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*", exposedHeaders: "*")]
        [System.Web.Http.HttpDelete]
        [ResponseType(typeof(Employee))]
        public IHttpActionResult DeleteEmployee(int id)
        {
            Employee employee = db.Employees.Find(id);
            if (employee == null)
            {
                return NotFound();
            }

            db.Employees.Remove(employee);
            db.SaveChanges();

            return Ok(employee);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool EmployeeExists(int? id)
        {
            return db.Employees.Count(e => e.UserID == id) > 0;
        }
    }
}