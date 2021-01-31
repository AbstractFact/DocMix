using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.Models
{
    public class MyDoc
    {
        public string ID { get; set; }

        public string Name { get; set; }

        public string Category { get; set; }
    }
}
