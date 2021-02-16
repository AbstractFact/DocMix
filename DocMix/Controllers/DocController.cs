using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Services;
using DocMix.Models;
using DocMix.DTOs;
using System.IO;

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
        public ActionResult<FullDocDTO> Get(string id)
        {
            var doc = _docsService.Get(id);
            var pages = _pagesService.GetPages(id);

            if (doc == null)
            {
                return NotFound();
            }

            pages.ForEach(page =>
            {
                page.Elements.ForEach(element =>
                {
                    if (element.Text == null)
                    {
                        FileInfo fileInfo = new FileInfo(element.Content);
                        byte[] data = new byte[fileInfo.Length];

                        using (FileStream fs = fileInfo.OpenRead())
                        {
                            fs.Read(data, 0, data.Length);
                        }

                        String file = Convert.ToBase64String(data);

                        var extension = element.Content.Substring(element.Content.IndexOf('.') + 1);
                        string el = "data:image/" + extension + ";base64," + file;

                        element.Content = el;
                    }

                });
            });
            return new FullDocDTO(doc, pages);
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

        [HttpPost("GetDocsFiltered")]
        public ActionResult<List<Doc>> GetDocsFiltered([FromBody] DocFiltersDTO filters)
        {
            List<Doc> res = _docsService.GetDocsFiltered(filters);

            if (res != null)
                return Ok(res);
            else
                return NotFound();
        }
    }
}
