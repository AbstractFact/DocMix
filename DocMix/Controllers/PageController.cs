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
    public class PageController : ControllerBase
    {
        private readonly PageService _pagesService;

        public PageController(PageService pagesService)
        {
            _pagesService = pagesService;
        }

        [HttpGet]
        public ActionResult<List<Page>> Get() =>
            _pagesService.Get();

        [HttpGet("{id:length(24)}", Name = "GetPage")]
        public ActionResult<Page> Get(string id)
        {
            var doc = _pagesService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            return doc;
        }

        [HttpPost]
        public ActionResult<Page> Create(Page pag)
        {
            _pagesService.Create(pag);

            return CreatedAtRoute("GetPage", new { id = pag.ID.ToString() }, pag);
        }

        [HttpPut("Update/{id:length(24)}")]
        public IActionResult Update([FromBody] Page newpage, string id)
        {
            var doc = _pagesService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            _pagesService.Update(id, newpage);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public IActionResult Delete(string id)
        {
            var doc = _pagesService.Get(id);

            if (doc == null)
            {
                return NotFound();
            }

            _pagesService.Remove(doc.ID);

            return NoContent();
        }
    }
}
