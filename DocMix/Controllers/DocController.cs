using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Services;
using DocMix.Models;

namespace DocMix.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocController : ControllerBase
    {
        private readonly UserService _usersService;
        private readonly DocService _docsService;
        private readonly PageService _pagesService;

        public DocController(UserService usersService, DocService docsService, PageService pagesService)
        {
            _usersService = usersService;
            _docsService = docsService;
            _pagesService = pagesService;
        }

        [HttpGet]
        public ActionResult<List<Doc>> Get() =>
            _docsService.Get();

        [HttpGet("{id:length(24)}", Name = "GetDoc")]
        public ActionResult<object> Get(string id)
        {
            var doc = _docsService.Get(id);
            var pages = _pagesService.GetPages(id);

            if (doc == null)
            {
                return NotFound();
            }

            return new {d=doc, p=pages};
        }

        [HttpPost]
        public ActionResult<Doc> Create(Doc doc)
        {
            _docsService.Create(doc);

            return CreatedAtRoute("GetDoc", new { id = doc.ID.ToString() }, doc);
        }

        [HttpPut("{id:length(24)}")]
        public IActionResult Update(string id, Doc newdoc)
        {
            var doc = _docsService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            _docsService.Update(id, newdoc);
            _usersService.Update(newdoc);

            return Ok();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var doc = _docsService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            _docsService.Remove(id);
            _pagesService.RemoveDocPages(id);

            return Ok();
        }
    }
}
