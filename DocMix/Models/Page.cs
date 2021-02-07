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
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }
        public string DocumentID { get; set; }
        public List<Element> Elements { get; set; }
        public double Position { get; set; }

        public Page()
        {
            Elements = new List<Element>();
        }
    }
}
