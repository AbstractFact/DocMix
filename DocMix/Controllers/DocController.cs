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
        private readonly DocService _docsService;

        public DocController(DocService docsService)
        {
            _docsService = docsService;
        }

        [HttpGet]
        public ActionResult<List<Doc>> Get() =>
            _docsService.Get();

        [HttpGet("{id:length(24)}", Name = "GetDoc")]
        public ActionResult<Doc> Get(string id)
        {
            var doc = _docsService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            return doc;
        }

        [HttpPost]
        public ActionResult<Doc> Create(Doc doc)
        {
            _docsService.Create(doc);

            return CreatedAtRoute("GetDoc", new { id = doc.ID.ToString() }, doc);//???
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

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var doc = _docsService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            _docsService.Remove(doc.ID);

            return NoContent();
        }
    }
}
