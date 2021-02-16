using DocMix.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.DTOs
{
    public class FullDocDTO
    {
        public Doc Doc {get;set;}
        public List<Page> Pages { get; set;}

        public FullDocDTO(Doc d, List<Page> p)
        {
            this.Doc = d;
            this.Pages = p;
        }
    }
}
