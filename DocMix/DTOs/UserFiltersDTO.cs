using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocMix.Models;

namespace DocMix.DTOs
{
    public class UserFiltersDTO
    {
        public string Name { get; set; }

        public string Country { get; set; }
    }
}
