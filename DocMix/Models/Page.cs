using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.Models
{
    public class Page
    {
        public int Number { get; set; }
        public int ParagraphsNum { get; set; }
        public int PicturesNum { get; set; }
        public List<Element> Elements { get; set; }
    }
}
