using DocMix.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.DTOs
{
    public class UserHomeDTO
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public UserHomeDTO(User u)
        {
            this.ID = u.ID;
            this.Name = u.Name;
            this.Country = u.Country;
        }
    }
}
