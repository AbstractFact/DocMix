using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Services;
using DocMix.Models;
using MongoDB.Driver;

namespace DocMix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _usersService;

        public UserController(UserService usersService)
        {
            _usersService = usersService;
        }

        [HttpGet]
        public ActionResult<List<User>> Get() =>
            _usersService.Get();

        [HttpGet("{id:length(24)}", Name = "GetUser")]
        public ActionResult<User> Get(string id)
        {
            var user = _usersService.Get(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public ActionResult<User> Create(User user)
        {
            _usersService.Create(user);

            return CreatedAtRoute("GetUser", new { id = user.ID.ToString() }, user);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, User newuser)
        {
            var user = _usersService.Get(id);

            if (user == null)
            {
                return NotFound();
            }

            _usersService.Update(id, newuser);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var user = _usersService.Get(id);

            if (user == null)
            {
                return NotFound();
            }

            _usersService.Remove(user.ID);

            return NoContent();
        }

        [HttpPost("Login")]
        public ActionResult<User> Login([FromBody] List<string> user)
        {
            User res = _usersService.Login(user[0], user[1]);

            if (res!=null)
                return Ok(res);
            else
                return NotFound();
        }

        [HttpGet("GetUserDocs/{id}")]
        public ActionResult<List<MyDoc>> GetUserDocs(string id)
        {
            List<MyDoc> res = _usersService.GetUserDocs(id);

            if (res != null)
                return Ok(res);
            else
                return NotFound();
        }

        [HttpDelete("DeleteDoc")]
        public ActionResult DeleteDoc([FromBody] List<string> user)
        {
            bool res = _usersService.DeleteDoc(user[0], user[1]);

            if (res != false)
                return Ok();
            else
                return NotFound();
        }
    }
}
