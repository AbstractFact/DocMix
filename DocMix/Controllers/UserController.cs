using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Services;
using DocMix.Models;
using MongoDB.Driver;
using DocMix.DTOs;

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
        public ActionResult<List<UserHomeDTO>> Get()
        {
            List<User> users = _usersService.Get();

            if (users == null)
            {
                return NotFound();
            }

            List<UserHomeDTO> userdtos = new List<UserHomeDTO>();

            foreach (User us in users)
            {
                userdtos.Add(new UserHomeDTO(us));
            }

            return Ok(userdtos);
        }
            

        [HttpGet("GetUserFull/{id:length(24)}")]
        public ActionResult<User> GetUserFull(string id)
        {
            var user = _usersService.GetUserFull(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpGet("{id:length(24)}", Name = "GetUser")]
        public ActionResult<UserDTO> Get(string id)
        {
            var user = _usersService.Get(id);

            if (user == null)
            {
                return NotFound();
            }

            return new UserDTO(user);
        }

        [HttpPost("GetUsersFiltered")]
        public ActionResult<List<UserHomeDTO>> GetUsersFiltered([FromBody] UserFiltersDTO filters)
        {
            List<User> users = _usersService.GetUsersFiltered(filters);

            if (users == null)
            {
                return NotFound();
            }

            List<UserHomeDTO> userdtos = new List<UserHomeDTO>();

            foreach (User us in users)
            {
                userdtos.Add(new UserHomeDTO(us));
            }

            return Ok(userdtos);
        }

        [HttpPost]
        public ActionResult<UserLoggedDTO> Create(User user)
        {
            User usr=_usersService.Create(user);
            if (usr == null)
                return BadRequest();
            return new UserLoggedDTO(usr);
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

        [HttpPut("EditUserInfo/{id:length(24)}")]
        public IActionResult EditUserInfo([FromBody] EditUserInfoDTO info, string id)
        {
            var user = _usersService.Get(id);

            if (user == null)
            {
                return NotFound();
            }

            _usersService.EditUserInfo(id, user, info);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var user = _usersService.GetUserFull(id);

            if (user == null)
            {
                return NotFound();
            }

            _usersService.Remove(user);

            return Ok();
        }

        [HttpPost("Login")]
        public ActionResult<UserLoggedDTO> Login([FromBody] UserLoginDTO login)
        {
            User res = _usersService.Login(login.Username, login.Password);

            if (res!=null)
                return Ok(new UserLoggedDTO(res));
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

        [HttpPost("GetUserDocsFiltered/{id}")]
        public ActionResult<List<MyDoc>> GetUserDocsFiltered([FromBody] DocFiltersDTO filters, string id)
        {
            List<MyDoc> res = _usersService.GetUserDocsFiltered(id, filters);

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
