﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.Models
{
    public class Doc
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string ID { get; set; }

        [BsonElement("Name")]
        [JsonProperty("Name")]
        public string Name { get; set; }

        [BsonElement("Category")]
        [JsonProperty("Category")]
        public string Category { get; set; }

        [BsonElement("Author")]
        [JsonProperty("Author")]
        public Author Author { get; set; }

        [BsonElement("PageNum")]
        [JsonProperty("PageNum")]
        public int PageNum { get; set; }

        [BsonElement("Public")]
        [JsonProperty("Public")]
        public bool Public { get; set; }
    }
}
