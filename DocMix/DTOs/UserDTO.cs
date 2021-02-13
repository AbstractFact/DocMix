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
    public class UserDTO
    {
        public string ID { get; set; }

        public string Name { get; set; }

        public string Country { get; set; }

        public string Username { get; set; }

        public List<MyDoc> MyDocs { get; set; }

        public UserDTO(User user)
        {
            this.ID = user.ID;
            this.Name = user.Name;
            this.Country = user.Country;
            this.Username = user.Username;
            this.MyDocs = user.MyDocs;
        }
    }
}
