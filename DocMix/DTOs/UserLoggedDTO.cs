using DocMix.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DocMix.DTOs
{
    public class UserLoggedDTO
    {
        public string ID { get; set; }
        public string Name { get; set; }

        public UserLoggedDTO(User u)
        {
            this.ID = u.ID;
            this.Name = u.Name;
        }
    }
}
